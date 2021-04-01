package hu.redriver.service.mapper;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

public class ZonedDateTimeDeserializer extends JsonDeserializer<ZonedDateTime> {
    @Override
    public ZonedDateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
        DateTimeFormatter barionDateTimeFormatter =  new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd'T'HH:mm:ss.SSS")
            .appendFraction(ChronoField.MILLI_OF_SECOND, 0, 3, true)
            .toFormatter();
        LocalDateTime localDateTime = LocalDateTime.parse(jsonParser.getText(), barionDateTimeFormatter);
        return ZonedDateTime.of(localDateTime, ZoneId.systemDefault());
    }
}
