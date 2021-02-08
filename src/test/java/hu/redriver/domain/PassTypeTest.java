package hu.redriver.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import hu.redriver.web.rest.TestUtil;

public class PassTypeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PassType.class);
        PassType passType1 = new PassType();
        passType1.setId(1L);
        PassType passType2 = new PassType();
        passType2.setId(passType1.getId());
        assertThat(passType1).isEqualTo(passType2);
        passType2.setId(2L);
        assertThat(passType1).isNotEqualTo(passType2);
        passType1.setId(null);
        assertThat(passType1).isNotEqualTo(passType2);
    }
}
