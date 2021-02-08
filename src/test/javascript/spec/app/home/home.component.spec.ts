import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { MaxmoveTestModule } from '../../test.module';
import { HomeComponent } from 'app/home/home.component';
import { ActivityService } from 'app/entities/activity/activity.service';

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
      activityService = TestBed.get(ActivityService);
    });

    it('Should call activityService.query on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(activityService.query).toHaveBeenCalled();
    });
  });
});
