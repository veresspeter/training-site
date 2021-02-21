import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MaxmoveTestModule } from '../../test.module';
import { ActivityTypeService } from 'app/shared/services/activity-type.service';
import { ActivityType } from 'app/shared/model/activity-type.model';
import { ActivityTypeUpdateComponent } from 'app/activity-type/activity-type-update/activity-type-update.component';

describe('Component Tests', () => {
  describe('ActivityType Management Update Component', () => {
    let comp: ActivityTypeUpdateComponent;
    let fixture: ComponentFixture<ActivityTypeUpdateComponent>;
    let service: ActivityTypeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxmoveTestModule],
        declarations: [ActivityTypeUpdateComponent],
        providers: [FormBuilder],
      })
        .overrideTemplate(ActivityTypeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ActivityTypeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ActivityTypeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ActivityType(123);
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
        const entity = new ActivityType();
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
