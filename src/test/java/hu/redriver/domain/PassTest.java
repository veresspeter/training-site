package hu.redriver.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import hu.redriver.web.rest.TestUtil;

public class PassTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Pass.class);
        Pass pass1 = new Pass();
        pass1.setId(1L);
        Pass pass2 = new Pass();
        pass2.setId(pass1.getId());
        assertThat(pass1).isEqualTo(pass2);
        pass2.setId(2L);
        assertThat(pass1).isNotEqualTo(pass2);
        pass1.setId(null);
        assertThat(pass1).isNotEqualTo(pass2);
    }
}
