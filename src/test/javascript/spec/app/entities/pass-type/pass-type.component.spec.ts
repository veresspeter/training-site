import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MaxmoveTestModule } from '../../../test.module';
import { PassTypeComponent } from 'app/entities/pass-type/pass-type.component';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { PassType } from 'app/shared/model/pass-type.model';

describe('Component Tests', () => {
  describe('PassType Management Component', () => {
    let comp: PassTypeComponent;
    let fixture: ComponentFixture<PassTypeComponent>;
    let service: PassTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [PassTypeComponent],
      })
        .overrideTemplate(PassTypeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PassTypeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PassTypeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new PassType(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.passTypes && comp.passTypes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
