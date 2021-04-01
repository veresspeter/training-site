package hu.redriver.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import hu.redriver.domain.enumeration.BarionPaymentStatus;
import hu.redriver.domain.enumeration.PaymentStatus;
import hu.redriver.service.dto.*;
import hu.redriver.service.mapper.StartZonedDateTimeDeserializer;
import org.apache.http.client.utils.URIBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.ZonedDateTime;
import java.util.UUID;

@Service
@Transactional
public class BarionService {
    @Value("${barion.baseUrl}")
    private String baseUrl;

    @Value("${barion.publicKey}")
    private String publicKey;

    @Value("${barion.POSKey}")
    private String privateKey;

    @Value("${barion.pixelId}")
    private String pixelId;

    @Value("${barion.walletAddress}")
    private String walletAddress;

    @Value("${server.name}")
    private String serverAddress;

    @Value("${server.fePort}")
    private String serverPort;

    private final AppUserService appUserService;
    private final PassService passService;
    private final PassTypeService passTypeService;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public BarionService(AppUserService appUserService, PassTypeService passTypeService, PassService passService) {
        this.appUserService = appUserService;
        this.passService = passService;
        this.passTypeService = passTypeService;
        this.httpClient = HttpClient.newHttpClient();
        this.objectMapper = new ObjectMapper();

        SimpleModule module = new SimpleModule();
        module.addDeserializer(ZonedDateTime.class, new StartZonedDateTimeDeserializer());

        this.objectMapper.registerModule(module);
        this.objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public String startPayment(PassDTO passDTO) throws IOException {
        HttpRequest request = createStartRequest(passDTO);
        BarionPaymentResponseDTO responseDTO = sendStartRequest(request);

        if (responseDTO != null) {
            updatePass(passDTO, responseDTO);
            return responseDTO.getGatewayUrl();
        } else {
            throw new RuntimeException("Barion szerver válasz nem található");
        }
    }

    public void checkPayment(String paymentId) throws IOException, URISyntaxException {
        HttpRequest request = createCheckRequest(paymentId);
        sendCheckRequest(request);
    }

    private void sendCheckRequest(HttpRequest request) throws IOException {
        try {
            HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            BarionPaymentResponseDTO responseDTO = objectMapper.readValue(response.body(), BarionPaymentResponseDTO.class);
            updatePass(responseDTO);
        } catch (InterruptedException e) {
            e.printStackTrace();
            throw new RuntimeException("Sikertelen fizetés ellenőrzés");
        }
    }

    private void updatePass(BarionPaymentResponseDTO responseDTO) {
        PassDTO passDTO = passService.findOneByPaymentId(responseDTO.getPaymentId())
            .orElseThrow(() -> new RuntimeException("Bérlet nem található"));
        passDTO.setPaymentBarionStatus(responseDTO.getStatus());

        if (isWaiting(responseDTO)) {
            passDTO.setPaymentStatus(PaymentStatus.WAITING);
        }

        if (isApproved(responseDTO)) {
            passDTO.setPaymentStatus(PaymentStatus.APPROVED);
        }

        if (isaSucceed(responseDTO)) {
            passDTO.setPaymentStatus(PaymentStatus.PAID);
        }

        if (isFailed(responseDTO)) {
            passDTO.setPaymentStatus(PaymentStatus.UNPAID);
        }

        if (passDTO.getPaymentStatus() == PaymentStatus.PAID && responseDTO.getCompletedAt() != null ) {
            passDTO.setPaymentBarionTimestamp(responseDTO.getCompletedAt());
        }

        passService.save(passDTO);
    }

    private boolean isFailed(BarionPaymentResponseDTO responseDTO) {
        return responseDTO.getStatus() == BarionPaymentStatus.EXPIRED || responseDTO.getStatus() == BarionPaymentStatus.FAILED  || responseDTO.getStatus() == BarionPaymentStatus.CANCELED;
    }

    private boolean isaSucceed(BarionPaymentResponseDTO responseDTO) {
        return responseDTO.getStatus() == BarionPaymentStatus.SUCCEEDED;
    }

    private boolean isApproved(BarionPaymentResponseDTO responseDTO) {
        return responseDTO.getStatus() == BarionPaymentStatus.AUTHORIZED || responseDTO.getStatus() == BarionPaymentStatus.RESERVED  || responseDTO.getStatus() == BarionPaymentStatus.WAITING;
    }

    private boolean isWaiting(BarionPaymentResponseDTO responseDTO) {
        return responseDTO.getStatus() == BarionPaymentStatus.PREPARED || responseDTO.getStatus() == BarionPaymentStatus.STARTED  || responseDTO.getStatus() == BarionPaymentStatus.IN_PROGRESS;
    }

    private HttpRequest createCheckRequest(String paymentId) throws URISyntaxException {
        URI uri = new URIBuilder(baseUrl + "/v2/Payment/GetPaymentState")
            .addParameter("POSKey", privateKey)
            .addParameter("PaymentId", paymentId)
            .build();

        return HttpRequest.newBuilder()
            .uri(uri)
            .header("accept", "application/json")
            .header("Content-Type", "application/json")
            .GET()
            .build();
    }

    private BarionPaymentResponseDTO sendStartRequest(HttpRequest request) throws IOException {
        BarionPaymentResponseDTO responseDTO;
        try {
            HttpResponse<String> response = this.httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            responseDTO = objectMapper.readValue(response.body(), BarionPaymentResponseDTO.class);
        } catch (InterruptedException e) {
            e.printStackTrace();
            throw new RuntimeException("Sikertelen fizetés indítás");
        }
        return responseDTO;
    }

    private HttpRequest createStartRequest(PassDTO passDTO) throws JsonProcessingException {
        final PassTypeDTO passTypeDTO = passTypeService.findOne(passDTO.getPassTypeId())
            .orElseThrow(() -> new RuntimeException("Bérlet nem található"));

        BarionItemDTO DTO = createItemDTO(passTypeDTO);
        BarionPaymentTransactionDTO paymentTransactionDTO = createTransactionDTO(passTypeDTO, DTO);
        BarionStartPaymentRequestDTO paymentDTO = createPaymentDTO(passDTO, paymentTransactionDTO);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(baseUrl + "/v2/Payment/Start"))
            .header("accept", "application/json")
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(paymentDTO)))
            .build();
        return request;
    }

    private void updatePass(PassDTO passDTO, BarionPaymentResponseDTO responseDTO) {
        passDTO.setPaymentId(responseDTO.getPaymentId());
        passDTO.setPaymentBarionStatus(responseDTO.getStatus());

        passService.save(passDTO);
    }

    private BarionStartPaymentRequestDTO createPaymentDTO(PassDTO passDTO, BarionPaymentTransactionDTO paymentTransaction) {
        final AppUserDTO user = appUserService.findOne(passDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("Felhasználó nem található"));
        final String paymentId = UUID.randomUUID().toString();

        BarionStartPaymentRequestDTO paymentDTO = new BarionStartPaymentRequestDTO();
        paymentDTO.setPOSKey(privateKey);
        paymentDTO.setPaymentRequestId(paymentId);
        paymentDTO.setPayerHint(user.getInternalUserDTO().getEmail());
        paymentDTO.setCardHolderNameHint(user.getInternalUserDTO().getLastName() + " " + user.getInternalUserDTO().getFirstName());
        paymentDTO.setRedirectUrl(serverAddress + ":" + serverPort + "/payment-redirect");
        paymentDTO.setCallbackUrl(serverAddress + ":" + serverPort + "/api/passes/payment-callback");
        paymentDTO.setTransactions(new BarionPaymentTransactionDTO[]{paymentTransaction});
        return paymentDTO;
    }

    private BarionPaymentTransactionDTO createTransactionDTO(PassTypeDTO passTypeDTO, BarionItemDTO item) {
        BarionPaymentTransactionDTO paymentTransactionDTO = new BarionPaymentTransactionDTO();
        paymentTransactionDTO.setPOSTransactionId(UUID.randomUUID().toString());
        paymentTransactionDTO.setPayee(walletAddress);
        paymentTransactionDTO.setTotal(passTypeDTO.getPrice());
        paymentTransactionDTO.setItems(new BarionItemDTO[]{item});
        return paymentTransactionDTO;
    }

    private BarionItemDTO createItemDTO(PassTypeDTO passTypeDTO) {
        BarionItemDTO itemDTO = new BarionItemDTO();
        itemDTO.setName(passTypeDTO.getBillingName());
        itemDTO.setDescription(passTypeDTO.getName());
        itemDTO.setQuantity(1);
        itemDTO.setUnit("darab");
        itemDTO.setUnitPrice(passTypeDTO.getPrice());
        itemDTO.setItemTotal(passTypeDTO.getPrice());
        return itemDTO;
    }
}
