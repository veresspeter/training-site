package hu.redriver.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A PassType.
 */
@Entity
@Table(name = "pass_type")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PassType implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "duration_days")
    private Integer durationDays;

    @NotNull
    @Column(name = "price", nullable = false)
    private Integer price;

    @NotNull
    @Column(name = "unit", nullable = false)
    private String unit;

    @NotNull
    @Column(name = "occasions", nullable = false)
    private Integer occasions;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = "passTypes", allowSetters = true)
    private ActivityType availableForType;

    @ManyToOne
    @JsonIgnoreProperties(value = "passTypes", allowSetters = true)
    private Activity availableForActivity;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public PassType name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public PassType description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public PassType durationDays(Integer durationDays) {
        this.durationDays = durationDays;
        return this;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public Integer getPrice() {
        return price;
    }

    public PassType price(Integer price) {
        this.price = price;
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getUnit() {
        return unit;
    }

    public PassType unit(String unit) {
        this.unit = unit;
        return this;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getOccasions() {
        return occasions;
    }

    public PassType occasions(Integer occasions) {
        this.occasions = occasions;
        return this;
    }

    public void setOccasions(Integer occasions) {
        this.occasions = occasions;
    }

    public ActivityType getAvailableForType() {
        return availableForType;
    }

    public PassType availableForType(ActivityType activityType) {
        this.availableForType = activityType;
        return this;
    }

    public void setAvailableForType(ActivityType activityType) {
        this.availableForType = activityType;
    }

    public Activity getAvailableForActivity() {
        return availableForActivity;
    }

    public PassType availableForActivity(Activity activity) {
        this.availableForActivity = activity;
        return this;
    }

    public void setAvailableForActivity(Activity activity) {
        this.availableForActivity = activity;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PassType)) {
            return false;
        }
        return id != null && id.equals(((PassType) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PassType{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", durationDays=" + getDurationDays() +
            ", price=" + getPrice() +
            ", unit='" + getUnit() + "'" +
            ", occasions=" + getOccasions() +
            "}";
    }
}
