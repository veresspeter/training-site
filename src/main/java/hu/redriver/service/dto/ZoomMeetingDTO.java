package hu.redriver.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.ZonedDateTime;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ZoomMeetingDTO {
    private String uuid;
    private String id;
    private String password;
    private String join_url;
    private String start_url;
    private String created_at;
    private String start_time;
    private Integer duration;
    private String topic;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getJoin_url() {
        return join_url;
    }

    public void setJoin_url(String join_url) {
        this.join_url = join_url;
    }

    public String getStart_url() {
        return start_url;
    }

    public void setStart_url(String start_url) {
        this.start_url = start_url;
    }

    public String getStart_time() {
        return start_time;
    }

    public void setStart_time(String start_time) {
        this.start_time = start_time;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }
}
