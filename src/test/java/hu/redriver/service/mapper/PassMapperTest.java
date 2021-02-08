package hu.redriver.service.mapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class PassMapperTest {

    private PassMapper passMapper;

    @BeforeEach
    public void setUp() {
        passMapper = new PassMapperImpl();
    }

    @Test
    public void testEntityFromId() {
        Long id = 1L;
        assertThat(passMapper.fromId(id).getId()).isEqualTo(id);
        assertThat(passMapper.fromId(null)).isNull();
    }
}
