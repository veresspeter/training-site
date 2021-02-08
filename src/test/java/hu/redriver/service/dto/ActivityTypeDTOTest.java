package hu.redriver.service.dto;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import hu.redriver.web.rest.TestUtil;

public class ActivityTypeDTOTest {

    @Test
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActivityTypeDTO.class);
        ActivityTypeDTO activityTypeDTO1 = new ActivityTypeDTO();
        activityTypeDTO1.setId(1L);
        ActivityTypeDTO activityTypeDTO2 = new ActivityTypeDTO();
        assertThat(activityTypeDTO1).isNotEqualTo(activityTypeDTO2);
        activityTypeDTO2.setId(activityTypeDTO1.getId());
        assertThat(activityTypeDTO1).isEqualTo(activityTypeDTO2);
        activityTypeDTO2.setId(2L);
        assertThat(activityTypeDTO1).isNotEqualTo(activityTypeDTO2);
        activityTypeDTO1.setId(null);
        assertThat(activityTypeDTO1).isNotEqualTo(activityTypeDTO2);
    }
}
