package hu.redriver.web.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import hu.redriver.domain.PersistentToken;
import hu.redriver.repository.PersistentTokenRepository;
import hu.redriver.domain.User;
import hu.redriver.repository.UserRepository;
import hu.redriver.security.SecurityUtils;
import hu.redriver.service.*;
import hu.redriver.service.dto.*;
import hu.redriver.service.mapper.UserMapper;
import hu.redriver.web.rest.errors.*;
import hu.redriver.web.rest.errors.EmailAlreadyUsedException;
import hu.redriver.web.rest.errors.InvalidPasswordException;
import hu.redriver.web.rest.vm.KeyAndPasswordVM;
import hu.redriver.web.rest.vm.ManagedUserVM;

import hu.redriver.web.utils.agora.media.RtcTokenBuilder;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.*;

/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class AccountResource {

    public static final String APP_ID = "44a98ea971f84d67aae6c23a87a9af5c";
    public static final String APP_CERTIFICATE = "947e84ec27094d5ab5ff7a8487538023";

    private static class AccountResourceException extends RuntimeException {
        private AccountResourceException(String message) {
            super(message);
        }
    }

    private final Logger log = LoggerFactory.getLogger(AccountResource.class);

    private final UserRepository userRepository;
    private final AppUserService appUserService;
    private final UserService userService;
    private final MailService mailService;
    private final PersistentTokenRepository persistentTokenRepository;
    private final UserMapper userMapper;
    private final RtcTokenBuilder tokenBuilder;
    private final EventService eventService;
    private final PassService passService;

    public AccountResource(UserRepository userRepository,
                           AppUserService appUserService,
                           UserService userService,
                           MailService mailService,
                           PersistentTokenRepository persistentTokenRepository,
                           UserMapper userMapper,
                           EventService eventService,
                           PassService passService) {
        this.userRepository = userRepository;
        this.appUserService = appUserService;
        this.userService = userService;
        this.mailService = mailService;
        this.persistentTokenRepository = persistentTokenRepository;
        this.userMapper = userMapper;
        this.eventService = eventService;
        this.passService = passService;
        this.tokenBuilder = new RtcTokenBuilder();
    }

    /**
     * {@code POST  /register} : register the user.
     *
     * @param managedUserVM the managed user View Model.
     * @throws InvalidPasswordException  {@code 400 (Bad Request)} if the password is incorrect.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws LoginAlreadyUsedException {@code 400 (Bad Request)} if the login is already used.
     */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registerAccount(@Valid @RequestBody ManagedUserVM managedUserVM) {
        if (!checkPasswordLength(managedUserVM.getPassword())) {
            throw new InvalidPasswordException();
        }
        User user = userService.registerUser(managedUserVM, managedUserVM.getPassword());

        AppUserDTO appUser = new AppUserDTO();
        appUser.setInternalUserDTO(userMapper.userToUserDTO(user));
        appUser.setIsTrainer(false);
        this.appUserService.save(appUser);

        mailService.sendActivationEmail(user);
    }

    /**
     * {@code GET  /activate} : activate the registered user.
     *
     * @param key the activation key.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user couldn't be activated.
     */
    @GetMapping("/activate")
    public void activateAccount(@RequestParam(value = "key") String key) {
        Optional<User> user = userService.activateRegistration(key);
        if (!user.isPresent()) {
            throw new AccountResourceException("Nem tal??lhat?? felhaszn??l?? ezzel az aktiv??l?? kulcssal");
        }
    }

    /**
     * {@code GET  /authenticate} : check if the user is authenticated, and return its login.
     *
     * @param request the HTTP request.
     * @return the login if the user is authenticated.
     */
    @GetMapping("/authenticate")
    public String isAuthenticated(HttpServletRequest request) {
        log.debug("REST request to check if the current user is authenticated");
        return request.getRemoteUser();
    }

    /**
     * {@code GET  /account} : get the current user.
     *
     * @return the current user.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the user couldn't be returned.
     */
    @GetMapping("/account")
    public AppUserDTO getAccount() {
        return appUserService.findOneByInternalUserId(getLoggedInUserDTO().getId())
            .orElseThrow(() -> new AccountResourceException("Felhaszn??l?? nem tal??lhat??"));
    }

    private UserDTO getLoggedInUserDTO() {
        return userService.getUserWithAuthorities()
            .map(UserDTO::new)
            .orElseThrow(() -> new AccountResourceException("Felhaszn??l?? nem tal??lhat??"));
    }

    @GetMapping("/account//my-passes")
    public List<PassDTO> getMyPasses() {
        AppUserDTO appUserDTO = appUserService.findOneByInternalUserId(getLoggedInUserDTO().getId())
            .orElseThrow(() -> new AccountResourceException("Felhaszn??l?? nem tal??lhat??"));

        return passService.findAllByAppUser(appUserDTO);
    }

    @GetMapping("/account/my-events")
    public List<EventDTO> getMyEvents() {
        AppUserDTO appUserDTO = appUserService.findOneByInternalUserId(getLoggedInUserDTO().getId())
            .orElseThrow(() -> new AccountResourceException("Felhaszn??l?? nem tal??lhat??"));

        return eventService.findAllByParticipantAndFromToday(appUserDTO);
    }

    @GetMapping("/agora-token")
    public String getAgoraToken(String timeStamp, String channelName) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        Integer userId = appUserService.findOneByInternalUserId(getLoggedInUserDTO().getId())
            .orElseThrow(() -> new AccountResourceException("Felhaszn??l?? nem tal??lhat??"))
            .getId()
            .intValue();
        int customUid = Integer.parseInt(userId.toString() + timeStamp.substring(6));
        int tS = Integer.parseInt(timeStamp) + 6 * 60 * 60;
        String token = tokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, customUid, RtcTokenBuilder.Role.Role_Admin, tS);
        return objectMapper.writeValueAsString(token);
    }

    /**
     * {@code POST  /account} : update the current user information.
     *
     * @param appUserDTO the current user information.
     * @throws EmailAlreadyUsedException {@code 400 (Bad Request)} if the email is already used.
     * @throws RuntimeException          {@code 500 (Internal Server Error)} if the user login wasn't found.
     */
    @PostMapping("/account")
    public void saveAccount(@Valid @RequestBody AppUserDTO appUserDTO) {
        String userLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new AccountResourceException("A jelenlegi felhaszn??l?? nem tal??lhat??"));

        AppUserDTO existingAppUserDTO = appUserService.findOneByInternalUserId(getLoggedInUserDTO().getId())
            .orElseThrow(() -> new AccountResourceException("Felhaszn??l?? nem tal??lhat??"));

        if (!appUserDTO.getInternalUserDTO().getId().equals(existingAppUserDTO.getInternalUserDTO().getId())) {
            throw new AccountResourceException("Hib??s adatok");
        }

        existingAppUserDTO.setBirthDay(appUserDTO.getBirthDay());
        existingAppUserDTO.setSex(appUserDTO.getSex());
        existingAppUserDTO.setImage(appUserDTO.getImage());
        existingAppUserDTO.setImageContentType(appUserDTO.getImageContentType());
        existingAppUserDTO.setInjury(appUserDTO.getInjury());
        existingAppUserDTO.setHeartProblem(appUserDTO.getHeartProblem());
        existingAppUserDTO.setMedicine(appUserDTO.getMedicine());
        existingAppUserDTO.setOtherProblem(appUserDTO.getOtherProblem());
        existingAppUserDTO.setRegularPain(appUserDTO.getRegularPain());
        existingAppUserDTO.setRespiratoryDisease(appUserDTO.getRespiratoryDisease());
        existingAppUserDTO.setSpineProblem(appUserDTO.getSpineProblem());
        existingAppUserDTO.setSurgery(appUserDTO.getSurgery());

        existingAppUserDTO.setGdprAccepted(appUserDTO.getGdprAccepted());
        existingAppUserDTO.setSelfResponsibility(appUserDTO.getSelfResponsibility());

        Optional<User> existingUser = userRepository.findOneByEmailIgnoreCase(appUserDTO.getInternalUserDTO().getEmail());
        if (existingUser.isPresent() && (!existingUser.get().getLogin().equalsIgnoreCase(userLogin))) {
            throw new EmailAlreadyUsedException();
        }
        Optional<User> user = userRepository.findOneByLogin(userLogin);
        if (!user.isPresent()) {
            throw new AccountResourceException("Felhaszn??l?? nem tal??lhat??");
        }

        appUserService.save(existingAppUserDTO);
        userService.updateUser(appUserDTO.getInternalUserDTO().getFirstName(), appUserDTO.getInternalUserDTO().getLastName(), appUserDTO.getInternalUserDTO().getEmail(),
            appUserDTO.getInternalUserDTO().getLangKey(), appUserDTO.getInternalUserDTO().getImageUrl());
    }

    /**
     * {@code POST  /account/change-password} : changes the current user's password.
     *
     * @param passwordChangeDto current and new password.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the new password is incorrect.
     */
    @PostMapping(path = "/account/change-password")
    public void changePassword(@RequestBody PasswordChangeDTO passwordChangeDto) {
        if (!checkPasswordLength(passwordChangeDto.getNewPassword())) {
            throw new InvalidPasswordException();
        }
        userService.changePassword(passwordChangeDto.getCurrentPassword(), passwordChangeDto.getNewPassword());
    }

    /**
     * {@code GET  /account/sessions} : get the current open sessions.
     *
     * @return the current open sessions.
     * @throws RuntimeException {@code 500 (Internal Server Error)} if the current open sessions couldn't be retrieved.
     */
    @GetMapping("/account/sessions")
    public List<PersistentToken> getCurrentSessions() {
        return persistentTokenRepository.findByUser(
            userRepository.findOneByLogin(SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new AccountResourceException("Az aktu??lis felhaszn??l?? bejelentkez??si adata nem tal??lhat??")))
                .orElseThrow(() -> new AccountResourceException("Felhaszn??l?? nem tal??lhat??"))
        );
    }

    /**
     * {@code DELETE  /account/sessions?series={series}} : invalidate an existing session.
     * <p>
     * - You can only delete your own sessions, not any other user's session
     * - If you delete one of your existing sessions, and that you are currently logged in on that session, you will
     * still be able to use that session, until you quit your browser: it does not work in real time (there is
     * no API for that), it only removes the "remember me" cookie
     * - This is also true if you invalidate your current session: you will still be able to use it until you close
     * your browser or that the session times out. But automatic login (the "remember me" cookie) will not work
     * anymore.
     * There is an API to invalidate the current session, but there is no API to check which session uses which
     * cookie.
     *
     * @param series the series of an existing session.
     * @throws UnsupportedEncodingException if the series couldn't be URL decoded.
     */
    @DeleteMapping("/account/sessions/{series}")
    public void invalidateSession(@PathVariable String series) throws UnsupportedEncodingException {
        String decodedSeries = URLDecoder.decode(series, "UTF-8");
        SecurityUtils.getCurrentUserLogin()
            .flatMap(userRepository::findOneByLogin)
            .ifPresent(u ->
                persistentTokenRepository.findByUser(u).stream()
                    .filter(persistentToken -> StringUtils.equals(persistentToken.getSeries(), decodedSeries))
                    .findAny().ifPresent(t -> persistentTokenRepository.deleteById(decodedSeries)));
    }

    /**
     * {@code POST   /account/reset-password/init} : Send an email to reset the password of the user.
     *
     * @param mail the mail of the user.
     */
    @PostMapping(path = "/account/reset-password/init")
    public void requestPasswordReset(@RequestBody String mail) {
        Optional<User> user = userService.requestPasswordReset(mail);
        if (user.isPresent()) {
            mailService.sendPasswordResetMail(user.get());
        } else {
            // Pretend the request has been successful to prevent checking which emails really exist
            // but log that an invalid attempt has been made
            log.warn("Jelsz??eml??keztet?? ismeretlen e-mail c??mhez");
        }
    }

    /**
     * {@code POST   /account/reset-password/finish} : Finish to reset the password of the user.
     *
     * @param keyAndPassword the generated key and the new password.
     * @throws InvalidPasswordException {@code 400 (Bad Request)} if the password is incorrect.
     * @throws RuntimeException         {@code 500 (Internal Server Error)} if the password could not be reset.
     */
    @PostMapping(path = "/account/reset-password/finish")
    public void finishPasswordReset(@RequestBody KeyAndPasswordVM keyAndPassword) {
        if (!checkPasswordLength(keyAndPassword.getNewPassword())) {
            throw new InvalidPasswordException();
        }
        Optional<User> user =
            userService.completePasswordReset(keyAndPassword.getNewPassword(), keyAndPassword.getKey());

        if (!user.isPresent()) {
            throw new AccountResourceException("Nem tal??lhat?? felhaszn??l?? a helyre??ll??t?? kulcshoz");
        }
    }

    private static boolean checkPasswordLength(String password) {
        return !StringUtils.isEmpty(password) &&
            password.length() >= ManagedUserVM.PASSWORD_MIN_LENGTH &&
            password.length() <= ManagedUserVM.PASSWORD_MAX_LENGTH;
    }
}
