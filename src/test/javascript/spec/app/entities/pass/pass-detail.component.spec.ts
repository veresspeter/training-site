import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MaxmoveTestModule } from '../../../test.module';
import { PassDetailComponent } from 'app/entities/pass/pass-detail/pass-detail.component';
import { Pass } from 'app/shared/model/pass.model';

describe('Component Tests', () => {
  describe('Pass Management Detail Component', () => {
    let comp: PassDetailComponent;
    let fixture: ComponentFixture<PassDetailComponent>;
    const route = ({ data: of({ pass: new Pass(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [PassDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(PassDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PassDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load pass on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.pass).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
