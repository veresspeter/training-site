import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { MaxmoveTestModule } from '../../../test.module';
import { ActivityTypeDetailComponent } from 'app/entities/activity-type/activity-type-detail.component';
import { ActivityType } from 'app/shared/model/activity-type.model';

describe('Component Tests', () => {
  describe('ActivityType Management Detail Component', () => {
    let comp: ActivityTypeDetailComponent;
    let fixture: ComponentFixture<ActivityTypeDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ activityType: new ActivityType(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [ActivityTypeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ActivityTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ActivityTypeDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load activityType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.activityType).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });

    describe('byteSize', () => {
      it('Should call byteSize from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'byteSize');
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.byteSize(fakeBase64);

        // THEN
        expect(dataUtils.byteSize).toBeCalledWith(fakeBase64);
      });
    });

    describe('openFile', () => {
      it('Should call openFile from JhiDataUtils', () => {
        // GIVEN
        spyOn(dataUtils, 'openFile');
        const fakeContentType = 'fake content type';
        const fakeBase64 = 'fake base64';

        // WHEN
        comp.openFile(fakeContentType, fakeBase64);

        // THEN
        expect(dataUtils.openFile).toBeCalledWith(fakeContentType, fakeBase64);
      });
    });
  });
});
