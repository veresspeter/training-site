package hu.redriver.domain.enumeration;

import com.fasterxml.jackson.annotation.JsonValue;

public enum BarionPaymentStatus {
    PREPARED("Prepared"),
    STARTED("Started"),
    IN_PROGRESS("InProgress"),
    WAITING("Waiting"),
    RESERVED("Reserved"),
    AUTHORIZED("Authorized"),
    CANCELED("Canceled"),
    SUCCEEDED("Succeeded"),
    FAILED("Failed"),
    PARTIALLY_SUCCEEDED("PartiallySucceeded"),
    EXPIRED("Expired");

    public final String value;

    BarionPaymentStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
