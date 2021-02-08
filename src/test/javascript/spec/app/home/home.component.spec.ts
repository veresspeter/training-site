import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MaxmoveTestModule } from '../../test.module';
import { HomeComponent } from 'app/home/home.component';
import { ActivityService } from 'app/entities/activity/activity.service';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Activity } from 'app/shared/model/activity.model';

describe('Component Tests', () => {
  describe('Home Component', () => {
    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let activityService: ActivityService;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [HomeComponent],
      })
        .overrideTemplate(HomeComponent, '')
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(HomeComponent);
      comp = fixture.componentInstance;
      activityService = fixture.debugElement.injector.get(ActivityService);
    });

    it('Should call activityService.query on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(activityService, 'query').and.returnValue(
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
      expect(activityService.query).toHaveBeenCalled();
    });
  });
});
