import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { MaxmoveTestModule } from '../../../test.module';
import { PassComponent } from 'app/entities/pass/pass.component';
import { PassService } from 'app/entities/pass/pass.service';
import { Pass } from 'app/shared/model/pass.model';

describe('Component Tests', () => {
  describe('Pass Management Component', () => {
    let comp: PassComponent;
    let fixture: ComponentFixture<PassComponent>;
    let service: PassService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [PassComponent],
      })
        .overrideTemplate(PassComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PassComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PassService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Pass(123)],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.passes && comp.passes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
