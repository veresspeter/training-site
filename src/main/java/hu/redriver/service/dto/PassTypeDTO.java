package hu.redriver.service.dto;

import javax.validation.constraints.*;
import java.io.Serializable;

/**
 * A DTO for the {@link hu.redriver.domain.PassType} entity.
 */
public class PassTypeDTO implements Serializable {

    private Long id;

    @NotNull
    private String name;

    private String description;

    private Integer durationDays;

    @NotNull
    private Integer price;

    @NotNull
    private String unit;

    @NotNull
    private Integer occasions;


    private ActivityTypeDTO availableForType;

    private Long availableForActivityId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getOccasions() {
        return occasions;
    }

    public void setOccasions(Integer occasions) {
        this.occasions = occasions;
    }

    public ActivityTypeDTO getAvailableForType() {
        return availableForType;
    }

    public void setAvailableForType(ActivityTypeDTO activityType) {
        this.availableForType = activityType;
    }

    public Long getAvailableForActivityId() {
        return availableForActivityId;
    }

    public void setAvailableForActivityId(Long activityId) {
        this.availableForActivityId = activityId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PassTypeDTO)) {
            return false;
        }

        return id != null && id.equals(((PassTypeDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PassTypeDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", durationDays=" + getDurationDays() +
            ", price=" + getPrice() +
            ", unit='" + getUnit() + "'" +
            ", occasions=" + getOccasions() +
            ", availableForType=" + getAvailableForType() +
            ", availableForActivityId=" + getAvailableForActivityId() +
            "}";
    }
}
