package hu.redriver.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * A Pass.
 */
@Entity
@Table(name = "pass")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pass implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "purchased", nullable = false)
    private LocalDate purchased;

    @NotNull
    @Column(name = "usage_no", nullable = false)
    private Integer usageNo;

    @Column(name = "valid_from")
    private LocalDate validFrom;

    @Column(name = "valid_to")
    private LocalDate validTo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "passes", allowSetters = true)
    private PassType passType;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "passes", allowSetters = true)
    private ApplicationUser user;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getPurchased() {
        return purchased;
    }

    public Pass purchased(LocalDate purchased) {
        this.purchased = purchased;
        return this;
    }

    public void setPurchased(LocalDate purchased) {
        this.purchased = purchased;
    }

    public Integer getUsageNo() {
        return usageNo;
    }

    public Pass usageNo(Integer usageNo) {
        this.usageNo = usageNo;
        return this;
    }

    public void setUsageNo(Integer usageNo) {
        this.usageNo = usageNo;
    }

    public LocalDate getValidFrom() {
        return validFrom;
    }

    public Pass validFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
        return this;
    }

    public void setValidFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDate getValidTo() {
        return validTo;
    }

    public Pass validTo(LocalDate validTo) {
        this.validTo = validTo;
        return this;
    }

    public void setValidTo(LocalDate validTo) {
        this.validTo = validTo;
    }

    public PassType getPassType() {
        return passType;
    }

    public Pass passType(PassType passType) {
        this.passType = passType;
        return this;
    }

    public void setPassType(PassType passType) {
        this.passType = passType;
    }

    public ApplicationUser getUser() {
        return user;
    }

    public Pass user(ApplicationUser applicationUser) {
        this.user = applicationUser;
        return this;
    }

    public void setUser(ApplicationUser applicationUser) {
        this.user = applicationUser;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pass)) {
            return false;
        }
        return id != null && id.equals(((Pass) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pass{" +
            "id=" + getId() +
            ", purchased='" + getPurchased() + "'" +
            ", usageNo=" + getUsageNo() +
            ", validFrom='" + getValidFrom() + "'" +
            ", validTo='" + getValidTo() + "'" +
            "}";
    }
}
