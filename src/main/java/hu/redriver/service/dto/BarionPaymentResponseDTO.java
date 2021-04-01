package hu.redriver.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import hu.redriver.domain.enumeration.BarionPaymentStatus;

import java.time.ZonedDateTime;

public class BarionPaymentResponseDTO {
    @JsonProperty("PaymentId")
    private String paymentId;

    @JsonProperty("PaymentRequestId")
    private String paymentRequestId;

    @JsonProperty("Status")
    private BarionPaymentStatus status;

    @JsonProperty("CompletedAt")
    private ZonedDateTime completedAt;

    @JsonProperty("QRUrl")
    private String url;

    @JsonProperty("Transactions")
    private BarionProcessedTransaction[] transactions;

    @JsonProperty("RecurrenceResult")
    private String recurrenceResult;

    @JsonProperty("GatewayUrl")
    private String gatewayUrl;

    @JsonProperty("CallbackUrl")
    private String callbackUrl;

    @JsonProperty("RedirectUrl")
    private String redirectUrl;

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getPaymentRequestId() {
        return paymentRequestId;
    }

    public void setPaymentRequestId(String paymentRequestId) {
        this.paymentRequestId = paymentRequestId;
    }

    public BarionPaymentStatus getStatus() {
        return status;
    }

    public void setStatus(BarionPaymentStatus status) {
        this.status = status;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getRecurrenceResult() {
        return recurrenceResult;
    }

    public void setRecurrenceResult(String recurrenceResult) {
        this.recurrenceResult = recurrenceResult;
    }

    public BarionProcessedTransaction[] getTransactions() {
        return transactions;
    }

    public void setTransactions(BarionProcessedTransaction[] transactions) {
        this.transactions = transactions;
    }

    public String getGatewayUrl() {
        return gatewayUrl;
    }

    public void setGatewayUrl(String gatewayUrl) {
        this.gatewayUrl = gatewayUrl;
    }

    public String getCallbackUrl() {
        return callbackUrl;
    }

    public void setCallbackUrl(String callbackUrl) {
        this.callbackUrl = callbackUrl;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }

    public ZonedDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(ZonedDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
