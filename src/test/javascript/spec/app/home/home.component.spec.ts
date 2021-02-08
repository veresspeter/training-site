import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MaxmoveTestModule } from '../../test.module';
import { HomeComponent } from 'app/home/home.component';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivityTypeService } from 'app/entities/activity-type/activity-type.service';
import { ActivityType } from 'app/shared/model/activity-type.model';

describe('Component Tests', () => {
  describe('Home Component', () => {
    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let activityTypeService: ActivityTypeService;

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
