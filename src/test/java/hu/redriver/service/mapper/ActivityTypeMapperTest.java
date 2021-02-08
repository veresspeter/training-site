package hu.redriver.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class ActivityTypeMapperTest {

    private ActivityTypeMapper activityTypeMapper;

    @BeforeEach
    public void setUp() {
        activityTypeMapper = new ActivityTypeMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(activityTypeMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(activityTypeMapper.fromId(null)).isNull();
    }
}
