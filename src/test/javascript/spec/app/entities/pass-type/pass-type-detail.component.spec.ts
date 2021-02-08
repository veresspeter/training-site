import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MaxmoveTestModule } from '../../../test.module';
import { PassTypeDetailComponent } from 'app/entities/pass-type/pass-type-detail.component';
import { PassType } from 'app/shared/model/pass-type.model';

describe('Component Tests', () => {
  describe('PassType Management Detail Component', () => {
    let comp: PassTypeDetailComponent;
    let fixture: ComponentFixture<PassTypeDetailComponent>;
    const route = ({ data: of({ passType: new PassType(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [PassTypeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(PassTypeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PassTypeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load passType on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.passType).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
