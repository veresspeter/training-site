import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MaxmoveTestModule } from '../../../test.module';
import { PassTypeUpdateComponent } from 'app/entities/pass-type/pass-type-update.component';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { PassType } from 'app/shared/model/pass-type.model';

describe('Component Tests', () => {
  describe('PassType Management Update Component', () => {
    let comp: PassTypeUpdateComponent;
    let fixture: ComponentFixture<PassTypeUpdateComponent>;
    let service: PassTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [PassTypeUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(PassTypeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PassTypeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(PassTypeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new PassType(123);
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
        const entity = new PassType();
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
