import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MaxmoveTestModule } from '../../../test.module';
import { PassUpdateComponent } from 'app/entities/pass/pass-update/pass-update.component';
import { PassService } from 'app/entities/pass/pass.service';
import { Pass } from 'app/shared/model/pass.model';

describe('Component Tests', () => {
  describe('Pass Management Update Component', () => {
    let comp: PassUpdateComponent;
    let fixture: ComponentFixture<PassUpdateComponent>;
    let service: PassService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [PassUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(PassUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PassUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PassService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Pass(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Pass();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
