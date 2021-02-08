package hu.redriver.service.dto;

import java.time.LocalDate;
import javax.validation.constraints.*;
import java.io.Serializable;

/**
 * A DTO for the {@link hu.redriver.domain.Pass} entity.
 */
public class PassDTO implements Serializable {
    
    private Long id;

    @NotNull
    private LocalDate purchased;

    @NotNull
    private Integer usageNo;

    private LocalDate validFrom;

    private LocalDate validTo;


    private Long passTypeId;

    private Long userId;
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getPurchased() {
        return purchased;
    }

    public void setPurchased(LocalDate purchased) {
        this.purchased = purchased;
    }

    public Integer getUsageNo() {
        return usageNo;
    }

    public void setUsageNo(Integer usageNo) {
        this.usageNo = usageNo;
    }

    public LocalDate getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDate getValidTo() {
        return validTo;
    }

    public void setValidTo(LocalDate validTo) {
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

    public void setUserId(Long applicationUserId) {
        this.userId = applicationUserId;
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
