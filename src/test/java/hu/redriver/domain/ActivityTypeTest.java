package hu.redriver.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import hu.redriver.web.rest.TestUtil;

public class ActivityTypeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ActivityType.class);
        ActivityType activityType1 = new ActivityType();
        activityType1.setId(1L);
        ActivityType activityType2 = new ActivityType();
        activityType2.setId(activityType1.getId());
        assertThat(activityType1).isEqualTo(activityType2);
        activityType2.setId(2L);
        assertThat(activityType1).isNotEqualTo(activityType2);
        activityType1.setId(null);
        assertThat(activityType1).isNotEqualTo(activityType2);
    }
}
