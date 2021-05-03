import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { TrainingsiteTestModule } from '../../test.module';
import { ActivityTypeComponent } from 'app/activity-type/activity-type.component';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivityTypeService } from 'app/shared/services/activity-type.service';
import { ActivityType } from 'app/shared/model/activity-type.model';

describe('Component Tests', () => {
  describe('Home Component', () => {
    let comp: ActivityTypeComponent;
    let fixture: ComponentFixture<ActivityTypeComponent>;
    let activityTypeService: ActivityTypeService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [TrainingsiteTestModule],
        declarations: [ActivityTypeComponent],
      })
        .overrideTemplate(ActivityTypeComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(ActivityTypeComponent);
      comp = fixture.componentInstance;
      activityTypeService = fixture.debugElement.injector.get(ActivityTypeService);
    });

    it('Should call activityService.query on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(activityTypeService, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ActivityType(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(activityTypeService.query).toHaveBeenCalled();
    });
  });
});
