package hu.redriver.config;

import hu.redriver.security.*;

import io.github.jhipster.config.JHipsterProperties;
import io.github.jhipster.security.*;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.filter.CorsFilter;
import org.zalando.problem.spring.web.advice.security.SecurityProblemSupport;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
@Import(SecurityProblemSupport.class)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    private final String ZOOM_LINKS = "https://zoom.us " +
        "https://*.zoom.us " +
        "https://*.zoom.com.cn " +
        "wss://*.zoom.us ";
    private final String GOOGLE_LINKS = "https://storage.googleapis.com " +
        "https://www.google-analytics.com " +
        "https://www.googletagmanager.com "+
        "http://www.googletagmanager.com ";

    private final JHipsterProperties jHipsterProperties;

    private final RememberMeServices rememberMeServices;

    private final CorsFilter corsFilter;
    private final SecurityProblemSupport problemSupport;

    public SecurityConfiguration(JHipsterProperties jHipsterProperties, RememberMeServices rememberMeServices, CorsFilter corsFilter, SecurityProblemSupport problemSupport) {
        this.jHipsterProperties = jHipsterProperties;
        this.rememberMeServices = rememberMeServices;
        this.corsFilter = corsFilter;
        this.problemSupport = problemSupport;
    }

    @Bean
    public AjaxAuthenticationSuccessHandler ajaxAuthenticationSuccessHandler() {
        return new AjaxAuthenticationSuccessHandler();
    }

    @Bean
    public AjaxAuthenticationFailureHandler ajaxAuthenticationFailureHandler() {
        return new AjaxAuthenticationFailureHandler();
    }

    @Bean
    public AjaxLogoutSuccessHandler ajaxLogoutSuccessHandler() {
        return new AjaxLogoutSuccessHandler();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    public void configure(WebSecurity web) {
        web.ignoring()
            .antMatchers(HttpMethod.OPTIONS, "/**")
            .antMatchers("/app/**/*.{js,html}")
            .antMatchers("/i18n/**")
            .antMatchers("/content/**")
            .antMatchers("/node_modules/**")
            .antMatchers("/h2-console/**")
            .antMatchers("/swagger-ui/index.html")
            .antMatchers("/test/**");
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        // @formatter:off
        http
            .csrf()
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            .and()
            .addFilterBefore(corsFilter, CsrfFilter.class)
            .exceptionHandling()
            .authenticationEntryPoint(problemSupport)
            .accessDeniedHandler(problemSupport)
            .and()
            .rememberMe()
            .rememberMeServices(rememberMeServices)
            .rememberMeParameter("remember-me")
            .key(jHipsterProperties.getSecurity().getRememberMe().getKey())
            .and()
            .formLogin()
            .loginProcessingUrl("/api/authentication")
            .successHandler(ajaxAuthenticationSuccessHandler())
            .failureHandler(ajaxAuthenticationFailureHandler())
            .permitAll()
            .and()
            .logout()
            .logoutUrl("/api/logout")
            .logoutSuccessHandler(ajaxLogoutSuccessHandler())
            .permitAll()
            .and()
            .headers()
            .contentSecurityPolicy(
                "default-src 'self';" +
                    "frame-src 'self' data:;" +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' " + ZOOM_LINKS + GOOGLE_LINKS + " blob: ;" +
                    "style-src 'self' " + ZOOM_LINKS + GOOGLE_LINKS + " 'unsafe-inline';" +
                    "img-src 'self' " + ZOOM_LINKS + " data: " + GOOGLE_LINKS + " ;" +
                    "connect-src 'self' " + ZOOM_LINKS + " data: " + GOOGLE_LINKS +" ;" +
                    "font-src 'self' https://fonts.gstatic.com data:"
            )
            .and()
            .referrerPolicy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)
            .and()
            .featurePolicy("midi 'none'; sync-xhr 'none'; microphone 'none';" +
                "magnetometer 'none'; gyroscope 'none';" +
                "fullscreen 'self';" +
                "payment 'none'")
            .and()
            .frameOptions()
            .deny()
            .and()
            .authorizeRequests()
            .antMatchers("/api/authenticate").permitAll()
            .antMatchers("/api/register").permitAll()
            .antMatchers("/api/activate").permitAll()
            .antMatchers("/api/account/reset-password/init").permitAll()
            .antMatchers("/api/account/reset-password/finish").permitAll()
            .antMatchers("/api/activities").permitAll()
            .antMatchers("/api/activity-types").permitAll()
            .antMatchers("/api/activity-types/{id}").permitAll()
            .antMatchers("/api/events").permitAll()
            .antMatchers("/api/**").authenticated()
            .antMatchers("/websocket/tracker").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/websocket/**").permitAll()
            .antMatchers("/management/health").permitAll()
            .antMatchers("/management/info").permitAll()
            .antMatchers("/management/prometheus").permitAll()
            .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN);
        // @formatter:on
    }
}
