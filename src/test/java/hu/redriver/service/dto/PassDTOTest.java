package hu.redriver.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import hu.redriver.web.rest.TestUtil;

public class PassDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PassDTO.class);
        PassDTO passDTO1 = new PassDTO();
        passDTO1.setId(1L);
        PassDTO passDTO2 = new PassDTO();
        assertThat(passDTO1).isNotEqualTo(passDTO2);
        passDTO2.setId(passDTO1.getId());
        assertThat(passDTO1).isEqualTo(passDTO2);
        passDTO2.setId(2L);
        assertThat(passDTO1).isNotEqualTo(passDTO2);
        passDTO1.setId(null);
        assertThat(passDTO1).isNotEqualTo(passDTO2);
    }
}
