package hu.redriver.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import hu.redriver.service.dto.EventDTO;
import hu.redriver.service.dto.ZoomMeetingDTO;
import hu.redriver.service.dto.ZoomMeetingRequestDTO;
import hu.redriver.service.dto.ZoomMeetingSettingsDTO;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class ZoomAPIClientService {

    private final String JWT_TOKEN = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IkRTY243c3dhUU9LT0drYTlEWktZQmciLCJleHAiOjE2NDY3MzU0NjAsImlhdCI6MTYxNDU5NDY5MH0.mvZVMq8pKCuRAn_fgczYsIa1RwwoBQgaBELsDaXyqEc";


    public ZoomAPIClientService() {
    }

    public void createMeeting(EventDTO eventDTO) throws IOException, InterruptedException {
        final HttpClient httpClient = HttpClient.newHttpClient();
        final ObjectMapper objectMapper = new ObjectMapper();

        ZoomMeetingRequestDTO data = getZoomMeetingRequestDTO(eventDTO);

        HttpRequest zoomMeetingRequest = HttpRequest.newBuilder(
            URI.create("https://api.zoom.us/v2/users/veress.peter@redriver.hu/meetings")
        )
            .header("accept", "application/json")
            .header("Content-Type", "application/json")
            .header("authorization", JWT_TOKEN)
            .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(data)))
            .build();

        System.out.println(objectMapper.writeValueAsString(data));

        HttpResponse<String> response = httpClient.send(zoomMeetingRequest, HttpResponse.BodyHandlers.ofString());
        ZoomMeetingDTO zoomMeetingDTO = objectMapper.readValue(response.body(), ZoomMeetingDTO.class);

        eventDTO.setStreamLink(zoomMeetingDTO.getJoin_url());
        eventDTO.setZoomRoomNo(zoomMeetingDTO.getId());
        eventDTO.setZoomRoomPsw(zoomMeetingDTO.getPassword());
    }

    private ZoomMeetingRequestDTO getZoomMeetingRequestDTO(EventDTO eventDTO) {
        ZoomMeetingRequestDTO data = new ZoomMeetingRequestDTO();
        data.setPassword("maxmovepsw");
        data.setTimezone("Europe/Budapest");
        data.setType(2);
        data.setStart_time(eventDTO.getStart().format(DateTimeFormatter.ISO_ZONED_DATE_TIME));
        data.setDuration((int) ChronoUnit.MINUTES.between(eventDTO.getStart(), eventDTO.getEnd()));
        data.setTopic(eventDTO.getOrganizer().getFullName() + " " + eventDTO.getStart().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) + "Z");

        ZoomMeetingSettingsDTO settingsDTO = new ZoomMeetingSettingsDTO();
        settingsDTO.setJoin_before_host(true);
        data.setSettings(settingsDTO);
        return data;
    }

}
