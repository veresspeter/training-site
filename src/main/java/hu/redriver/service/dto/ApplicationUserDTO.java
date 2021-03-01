package hu.redriver.service.dto;

import java.time.LocalDate;
import javax.validation.constraints.*;
import java.io.Serializable;
import javax.persistence.Lob;
import hu.redriver.domain.enumeration.Sex;

/**
 * A DTO for the {@link hu.redriver.domain.ApplicationUser} entity.
 */
public class ApplicationUserDTO implements Serializable {

    private Long id;

    @NotNull
    private Integer credit;

    private String fullName;

    private Sex sex;

    private LocalDate birthDay;

    private String googleToken;

    private String facebookToken;

    @Lob
    private byte[] image;

    private String imageContentType;
    private String introduction;

    @NotNull
    private Boolean isTrainer;

    @NotNull
    private Long internalUserId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getCredit() {
        return credit;
    }

    public void setCredit(Integer credit) {
        this.credit = credit;
    }

    public Sex getSex() {
        return sex;
    }

    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public LocalDate getBirthDay() {
        return birthDay;
    }

    public void setBirthDay(LocalDate birthDay) {
        this.birthDay = birthDay;
    }

    public String getGoogleToken() {
        return googleToken;
    }

    public void setGoogleToken(String googleToken) {
        this.googleToken = googleToken;
    }

    public String getFacebookToken() {
        return facebookToken;
    }

    public void setFacebookToken(String facebookToken) {
        this.facebookToken = facebookToken;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public Boolean isIsTrainer() {
        return isTrainer;
    }

    public void setIsTrainer(Boolean isTrainer) {
        this.isTrainer = isTrainer;
    }

    public Long getInternalUserId() {
        return internalUserId;
    }

    public void setInternalUserId(Long userId) {
        this.internalUserId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ApplicationUserDTO)) {
            return false;
        }

        return id != null && id.equals(((ApplicationUserDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ApplicationUserDTO{" +
            "id=" + getId() +
            ", credit=" + getCredit() +
            ", sex='" + getSex() + "'" +
            ", birthDay='" + getBirthDay() + "'" +
            ", googleToken='" + getGoogleToken() + "'" +
            ", facebookToken='" + getFacebookToken() + "'" +
            ", image='" + getImage() + "'" +
            ", introduction='" + getIntroduction() + "'" +
            ", isTrainer='" + isIsTrainer() + "'" +
            ", internalUserId=" + getInternalUserId() +
            "}";
    }
}
