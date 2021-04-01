package hu.redriver.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import hu.redriver.domain.enumeration.BarionPaymentStatus;

public class BarionStartPaymentResponseDTO {
    @JsonProperty("PaymentId")
    private String paymentId;

    @JsonProperty("PaymentRequestId")
    private String paymentRequestId;

    @JsonProperty("Status")
    private BarionPaymentStatus status;

    @JsonProperty("")
    private String QRUrl;

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

    public String getQRUrl() {
        return QRUrl;
    }

    public void setQRUrl(String QRUrl) {
        this.QRUrl = QRUrl;
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
}
