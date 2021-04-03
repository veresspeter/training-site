package hu.redriver.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import hu.redriver.domain.enumeration.Sex;

/**
 * A ApplicationUser.
 */
@Entity
@Table(name = "application_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AppUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "sex")
    private Sex sex;

    @Column(name = "birth_day")
    private LocalDate birthDay;

    @Column(name = "google_token")
    private String googleToken;

    @Column(name = "facebook_token")
    private String facebookToken;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @Column(name = "introduction")
    private String introduction;

    @Column(name = "injury")
    private String injury;

    @Column(name = "surgery")
    private String surgery;

    @Column(name = "heart_problem")
    private String heartProblem;

    @Column(name = "respiratory_disease")
    private String respiratoryDisease;

    @Column(name = "spine_problem")
    private String spineProblem;

    @Column(name = "regular_pain")
    private String regularPain;

    @Column(name = "medicine")
    private String medicine;

    @Column(name = "other_problem")
    private String otherProblem;

    @NotNull
    @Column(name = "is_trainer", nullable = false)
    private Boolean isTrainer;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private User internalUser;

    @ManyToMany(mappedBy = "participants")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnore
    private Set<Event> events = new HashSet<>();

    @Column(name = "self_responsibility")
    private Boolean selfResponsibility;

    @Column(name = "gdpr_accepted")
    private Boolean gdprAccepted;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Sex getSex() {
        return sex;
    }

    public AppUser sex(Sex sex) {
        this.sex = sex;
        return this;
    }

    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public LocalDate getBirthDay() {
        return birthDay;
    }

    public AppUser birthDay(LocalDate birthDay) {
        this.birthDay = birthDay;
        return this;
    }

    public void setBirthDay(LocalDate birthDay) {
        this.birthDay = birthDay;
    }

    public String getGoogleToken() {
        return googleToken;
    }

    public AppUser googleToken(String googleToken) {
        this.googleToken = googleToken;
        return this;
    }

    public void setGoogleToken(String googleToken) {
        this.googleToken = googleToken;
    }

    public String getFacebookToken() {
        return facebookToken;
    }

    public AppUser facebookToken(String facebookToken) {
        this.facebookToken = facebookToken;
        return this;
    }

    public void setFacebookToken(String facebookToken) {
        this.facebookToken = facebookToken;
    }

    public byte[] getImage() {
        return image;
    }

    public AppUser image(byte[] image) {
        this.image = image;
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return imageContentType;
    }

    public AppUser imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public String getIntroduction() {
        return introduction;
    }

    public AppUser introduction(String introduction) {
        this.introduction = introduction;
        return this;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    public Boolean isIsTrainer() {
        return isTrainer;
    }

    public AppUser isTrainer(Boolean isTrainer) {
        this.isTrainer = isTrainer;
        return this;
    }

    public void setIsTrainer(Boolean isTrainer) {
        this.isTrainer = isTrainer;
    }

    public User getInternalUser() {
        return internalUser;
    }

    public AppUser internalUser(User user) {
        this.internalUser = user;
        return this;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public Set<Event> getEvents() {
        return events;
    }

    public AppUser events(Set<Event> events) {
        this.events = events;
        return this;
    }

    public AppUser addEvents(Event event) {
        this.events.add(event);
        event.getParticipants().add(this);
        return this;
    }

    public AppUser removeEvents(Event event) {
        this.events.remove(event);
        event.getParticipants().remove(this);
        return this;
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

    public void setEvents(Set<Event> events) {
        this.events = events;
    }

    public Boolean getSelfResponsibility() {
        return selfResponsibility;
    }

    public void setSelfResponsibility(Boolean selfResponsibility) {
        this.selfResponsibility = selfResponsibility;
    }

    public Boolean getGdprAccepted() {
        return gdprAccepted;
    }

    public void setGdprAccepted(Boolean gdprAccepted) {
        this.gdprAccepted = gdprAccepted;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppUser)) {
            return false;
        }
        return id != null && id.equals(((AppUser) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppUser{" +
            "id=" + getId() +
            ", sex='" + getSex() + "'" +
            ", birthDay='" + getBirthDay() + "'" +
            ", googleToken='" + getGoogleToken() + "'" +
            ", facebookToken='" + getFacebookToken() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", introduction='" + getIntroduction() + "'" +
            ", isTrainer='" + isIsTrainer() + "'" +
            "}";
    }
}
