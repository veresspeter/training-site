import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MaxmoveTestModule } from '../../../test.module';
import { ActivityTypeComponent } from 'app/entities/activity-type/activity-type.component';
import { ActivityTypeService } from 'app/shared/services/activity-type.service';
import { ActivityType } from 'app/shared/model/activity-type.model';

describe('Component Tests', () => {
  describe('ActivityType Management Component', () => {
    let comp: ActivityTypeComponent;
    let fixture: ComponentFixture<ActivityTypeComponent>;
    let service: ActivityTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [ActivityTypeComponent],
      })
        .overrideTemplate(ActivityTypeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActivityTypeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActivityTypeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
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
      expect(service.query).toHaveBeenCalled();
      expect(comp.activityTypes && comp.activityTypes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
