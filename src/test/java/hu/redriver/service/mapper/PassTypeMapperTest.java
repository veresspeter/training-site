package hu.redriver.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class PassTypeMapperTest {

    private PassTypeMapper passTypeMapper;

    @BeforeEach
    public void setUp() {
        passTypeMapper = new PassTypeMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(passTypeMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(passTypeMapper.fromId(null)).isNull();
    }
}
