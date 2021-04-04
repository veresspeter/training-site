package hu.redriver.service.dto;

import hu.redriver.domain.Pass;
import hu.redriver.domain.enumeration.BarionPaymentStatus;
import hu.redriver.domain.enumeration.PaymentStatus;

import java.time.LocalDate;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A DTO for the {@link hu.redriver.domain.Pass} entity.
 */
public class PassDTO implements Serializable {

    private Long id;
    private ZonedDateTime validFrom;
    private ZonedDateTime validTo;
    private String paymentId;
    private ZonedDateTime paymentBarionTimestamp;
    private BarionPaymentStatus paymentBarionStatus;

    @NotNull
    private ZonedDateTime purchased;

    @NotNull
    private Integer usageNo;

    @NotNull
    private Long passTypeId;

    @NotNull
    private Long userId;

    @NotNull
    private PaymentStatus paymentStatus;

    public PassDTO() {
    }

    public PassDTO(Pass pass) {
        this.id = pass.getId();
        this.purchased = pass.getPurchased();
        this.usageNo = pass.getUsageNo();
        this.validFrom = pass.getValidFrom();
        this.validTo = pass.getValidTo();
        this.passTypeId = pass.getPassType().getId();
        this.userId = pass.getUser().getId();
        this.paymentStatus = pass.getPaymentStatus();
        this.paymentId = pass.getPaymentId();
        this.paymentBarionTimestamp = pass.getPaymentBarionTimestamp();
        this.paymentBarionStatus = pass.getPaymentBarionStatus();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getPurchased() {
        return purchased;
    }

    public void setPurchased(ZonedDateTime purchased) {
        this.purchased = purchased;
    }

    public Integer getUsageNo() {
        return usageNo;
    }

    public void setUsageNo(Integer usageNo) {
        this.usageNo = usageNo;
    }

    public ZonedDateTime getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(ZonedDateTime validFrom) {
        this.validFrom = validFrom;
    }

    public ZonedDateTime getValidTo() {
        return validTo;
    }

    public void setValidTo(ZonedDateTime validTo) {
        this.validTo = validTo;
    }

    public Long getPassTypeId() {
        return passTypeId;
    }

    public void setPassTypeId(Long passTypeId) {
        this.passTypeId = passTypeId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long appUserId) {
        this.userId = appUserId;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public ZonedDateTime getPaymentBarionTimestamp() {
        return paymentBarionTimestamp;
    }

    public void setPaymentBarionTimestamp(ZonedDateTime paymentBarionTimestamp) {
        this.paymentBarionTimestamp = paymentBarionTimestamp;
    }

    public BarionPaymentStatus getPaymentBarionStatus() {
        return paymentBarionStatus;
    }

    public void setPaymentBarionStatus(BarionPaymentStatus paymentBarionStatus) {
        this.paymentBarionStatus = paymentBarionStatus;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PassDTO)) {
            return false;
        }

        return id != null && id.equals(((PassDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PassDTO{" +
            "id=" + getId() +
            ", purchased='" + getPurchased() + "'" +
            ", usageNo=" + getUsageNo() +
            ", validFrom='" + getValidFrom() + "'" +
            ", validTo='" + getValidTo() + "'" +
            ", passTypeId=" + getPassTypeId() +
            ", userId=" + getUserId() +
            "}";
    }
}
