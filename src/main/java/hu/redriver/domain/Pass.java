package hu.redriver.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sun.istack.NotNull;
import hu.redriver.domain.enumeration.BarionPaymentStatus;
import hu.redriver.domain.enumeration.PaymentStatus;
import org.hibernate.annotations.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CascadeType;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

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
    private ZonedDateTime purchased;

    @NotNull
    @Column(name = "usage_no", nullable = false)
    private Integer usageNo;

    @Column(name = "valid_from")
    private ZonedDateTime validFrom;

    @Column(name = "valid_to")
    private ZonedDateTime validTo;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "passes", allowSetters = true)
    private PassType passType;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "passes", allowSetters = true)
    private AppUser user;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Column(name = "payment_barion_status")
    private BarionPaymentStatus paymentBarionStatus;

    @Column(name = "payment_barion_timestamp")
    private ZonedDateTime paymentBarionTimestamp;

    @ManyToMany(fetch = FetchType.LAZY, targetEntity = EventParticipant.class, mappedBy = "passId")
    @Fetch(value = FetchMode.SUBSELECT)
    @Cascade(value = CascadeType.ALL)
    private Set<EventParticipant> events = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getPurchased() {
        return purchased;
    }

    public Pass purchased(ZonedDateTime purchased) {
        this.purchased = purchased;
        return this;
    }

    public void setPurchased(ZonedDateTime purchased) {
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

    public ZonedDateTime getValidFrom() {
        return validFrom;
    }

    public Pass validFrom(ZonedDateTime validFrom) {
        this.validFrom = validFrom;
        return this;
    }

    public void setValidFrom(ZonedDateTime validFrom) {
        this.validFrom = validFrom;
    }

    public ZonedDateTime getValidTo() {
        return validTo;
    }

    public Pass validTo(ZonedDateTime validTo) {
        this.validTo = validTo;
        return this;
    }

    public void setValidTo(ZonedDateTime validTo) {
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

    public AppUser getUser() {
        return user;
    }

    public Pass user(AppUser appUser) {
        this.user = appUser;
        return this;
    }

    public void setUser(AppUser appUser) {
        this.user = appUser;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here


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

    public void setPaymentBarionTimestamp(ZonedDateTime paymentTimestamp) {
        this.paymentBarionTimestamp = paymentTimestamp;
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
        if (!(o instanceof Pass)) {
            return false;
        }
        return id != null && id.equals(((Pass) o).id);
    }

    public Set<EventParticipant> getEvents() {
        return events;
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
