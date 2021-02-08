package hu.redriver.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import hu.redriver.web.rest.TestUtil;

public class PassTypeDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PassTypeDTO.class);
        PassTypeDTO passTypeDTO1 = new PassTypeDTO();
        passTypeDTO1.setId(1L);
        PassTypeDTO passTypeDTO2 = new PassTypeDTO();
        assertThat(passTypeDTO1).isNotEqualTo(passTypeDTO2);
        passTypeDTO2.setId(passTypeDTO1.getId());
        assertThat(passTypeDTO1).isEqualTo(passTypeDTO2);
        passTypeDTO2.setId(2L);
        assertThat(passTypeDTO1).isNotEqualTo(passTypeDTO2);
        passTypeDTO1.setId(null);
        assertThat(passTypeDTO1).isNotEqualTo(passTypeDTO2);
    }
}
