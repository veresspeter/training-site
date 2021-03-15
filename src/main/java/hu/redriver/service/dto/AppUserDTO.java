package hu.redriver.service.dto;

import java.time.LocalDate;
import javax.validation.constraints.*;
import java.io.Serializable;
import javax.persistence.Lob;

import com.fasterxml.jackson.annotation.JsonProperty;
import hu.redriver.domain.AppUser;
import hu.redriver.domain.enumeration.Sex;

/**
 * A DTO for the {@link AppUser} entity.
 */
public class AppUserDTO implements Serializable {

    private Long id;
    private Sex sex;
    private LocalDate birthDay;
    private String googleToken;
    private String facebookToken;
    private String imageContentType;
    private String introduction;
    private String injury;
    private String surgery;
    private String heartProblem;
    private String respiratoryDisease;
    private String spineProblem;
    private String regularPain;
    private String medicine;
    private String otherProblem;

    @Lob
    private byte[] image;

    @NotNull
    private Boolean isTrainer;

    @NotNull
    @JsonProperty("internalUser")
    private UserDTO internalUserDTO;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public UserDTO getInternalUserDTO() {
        return internalUserDTO;
    }

    public void setInternalUserDTO(UserDTO internalUserDTO) {
        this.internalUserDTO = internalUserDTO;
    }

    public String getInjury() {
        return injury;
    }

    public void setInjury(String injury) {
        this.injury = injury;
    }

    public String getSurgery() {
        return surgery;
    }

    public void setSurgery(String surgery) {
        this.surgery = surgery;
    }

    public String getHeartProblem() {
        return heartProblem;
    }

    public void setHeartProblem(String heartProblem) {
        this.heartProblem = heartProblem;
    }

    public String getRespiratoryDisease() {
        return respiratoryDisease;
    }

    public void setRespiratoryDisease(String respiratoryDisease) {
        this.respiratoryDisease = respiratoryDisease;
    }

    public String getSpineProblem() {
        return spineProblem;
    }

    public void setSpineProblem(String spineProblem) {
        this.spineProblem = spineProblem;
    }

    public String getRegularPain() {
        return regularPain;
    }

    public void setRegularPain(String regularPain) {
        this.regularPain = regularPain;
    }

    public String getMedicine() {
        return medicine;
    }

    public void setMedicine(String medicine) {
        this.medicine = medicine;
    }

    public String getOtherProblem() {
        return otherProblem;
    }

    public void setOtherProblem(String otherProblem) {
        this.otherProblem = otherProblem;
    }

    public Boolean getTrainer() {
        return isTrainer;
    }

    public void setTrainer(Boolean trainer) {
        isTrainer = trainer;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppUserDTO)) {
            return false;
        }

        return id != null && id.equals(((AppUserDTO) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUserDTO{" +
            "id=" + getId() +
            ", sex='" + getSex() + "'" +
            ", birthDay='" + getBirthDay() + "'" +
            ", googleToken='" + getGoogleToken() + "'" +
            ", facebookToken='" + getFacebookToken() + "'" +
            ", introduction='" + getIntroduction() + "'" +
            ", isTrainer='" + isIsTrainer() + "'" +
            "}";
    }
}
