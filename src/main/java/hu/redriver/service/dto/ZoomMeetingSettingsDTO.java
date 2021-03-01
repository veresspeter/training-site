package hu.redriver.service.dto;

public class ZoomMeetingSettingsDTO {
    boolean join_before_host;

    public boolean isJoin_before_host() {
        return join_before_host;
    }

    public void setJoin_before_host(boolean join_before_host) {
        this.join_before_host = join_before_host;
    }
}
