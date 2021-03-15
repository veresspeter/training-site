import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { JhiDataUtils } from 'ng-jhipster';

import { MaxmoveTestModule } from '../../../test.module';
import { ApplicationUserDetailComponent } from 'app/entities/application-user/detail/application-user-detail.component';
import { AppUser } from 'app/shared/model/application-user.model';

describe('Component Tests', () => {
  describe('ApplicationUser Management Detail Component', () => {
    let comp: ApplicationUserDetailComponent;
    let fixture: ComponentFixture<ApplicationUserDetailComponent>;
    let dataUtils: JhiDataUtils;
    const route = ({ data: of({ appUser: new AppUser(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [ApplicationUserDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ApplicationUserDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ApplicationUserDetailComponent);
      comp = fixture.componentInstance;
      dataUtils = fixture.debugElement.injector.get(JhiDataUtils);
    });

    describe('OnInit', () => {
      it('Should load applicationUser on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.appUser).toEqual(jasmine.objectContaining({ id: 123 }));
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
