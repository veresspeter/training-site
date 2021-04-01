package hu.redriver.domain.enumeration;

import com.fasterxml.jackson.annotation.JsonValue;

public enum PaymentStatus {
    NEW("NEW"), WAITING("WAITING"), APPROVED("APPROVED"), PAID("PAID"), UNPAID("UNPAID");

    public final String value;

    PaymentStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
