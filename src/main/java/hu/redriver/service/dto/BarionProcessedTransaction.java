package hu.redriver.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.ZonedDateTime;

public class BarionProcessedTransaction {
    @JsonProperty("POSTransactionId")
    private String transactionId;

    @JsonProperty("TransactionId")
    private String barionTransactionId;

    @JsonProperty("Status")
    private String transactionStatus;

    @JsonProperty("Currency")
    private String currency;

    @JsonProperty("TransactionTime")
    private ZonedDateTime transactionTime;

    @JsonProperty("RelatedId")
    private String relatedId;

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getBarionTransactionId() {
        return barionTransactionId;
    }

    public void setBarionTransactionId(String barionTransactionId) {
        this.barionTransactionId = barionTransactionId;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(String transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public ZonedDateTime getTransactionTime() {
        return transactionTime;
    }

    public void setTransactionTime(ZonedDateTime transactionTime) {
        this.transactionTime = transactionTime;
    }

    public String getRelatedId() {
        return relatedId;
    }

    public void setRelatedId(String relatedId) {
        this.relatedId = relatedId;
    }
}
