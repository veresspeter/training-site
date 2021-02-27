import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MaxmoveTestModule } from '../../../test.module';
import { ActivityListComponent } from 'app/activity-type/activity-list/activity-list.component';
import { ActivityService } from 'app/shared/services/activity.service';
import { Activity } from 'app/shared/model/activity.model';

describe('Component Tests', () => {
  describe('Activity Management Component', () => {
    let comp: ActivityListComponent;
    let fixture: ComponentFixture<ActivityListComponent>;
    let service: ActivityService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [ActivityListComponent],
      })
        .overrideTemplate(ActivityListComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActivityListComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActivityService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Activity(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.activities && comp.activities[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
