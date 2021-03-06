import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IEvent, Event } from 'app/shared/model/event.model';
import { EventService } from 'app/shared/services/event.service';
import { IAppUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { IActivity } from 'app/shared/model/activity.model';
import { ActivityService } from 'app/shared/services/activity.service';
import { LinkType } from 'app/shared/model/enumerations/link-type.model';

type SelectableEntity = IAppUser | IActivity;

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html',
})
export class EventUpdateComponent implements OnInit {
  isSaving = false;
  applicationUsers: IAppUser[] = [];
  activities: IActivity[] = [];

  editForm = this.fb.group({
    id: [],
    name: [undefined, [Validators.required]],
    start: [undefined, [Validators.required]],
    end: [undefined, [Validators.required]],
    limit: [],
    streamLink: [],
    streamLinkType: [],
    comment: [],
    organizerId: [undefined, Validators.required],
    activityId: [undefined, Validators.required],
    participants: [],
  });

  constructor(
    protected eventService: EventService,
    protected applicationUserService: ApplicationUserService,
    protected activityService: ActivityService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      if (!event.id) {
        const today = moment().startOf('day');
        event.start = today;
        event.end = today;
      }

      this.updateForm(event);

      this.applicationUserService.query().subscribe((res: HttpResponse<IAppUser[]>) => (this.applicationUsers = res.body || []));

      this.activityService
        .query()
        .subscribe(
          (res: HttpResponse<IActivity[]>) => (this.activities = res.body?.filter(activity => activity.activityTypeId === 1151) || [])
        );
    });
  }

  updateForm(event: IEvent): void {
    this.editForm.patchValue({
      id: event.id,
      name: event.name,
      start: event.start ? event.start.format(DATE_TIME_FORMAT) : null,
      end: event.end ? event.end.format(DATE_TIME_FORMAT) : null,
      limit: event.limit,
      streamLink: event.streamLink,
      streamLinkType: event.streamLinkType || 'ONLINE',
      comment: event.comment,
      organizerId: event.organizer?.id,
      activityId: event.activityId,
      participants: event.participants,
    });
  }

  setNevToFoglalkozas(): void {
    const activityId = this.editForm.get('activityId')?.value;
    this.editForm.get('name')?.setValue(this.activities.find(activity => activity.id === activityId)?.name);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.editForm.markAllAsTouched();
    if (this.editForm.valid) {
      this.isSaving = true;
      const event = this.createFromForm();
      if (event.id !== undefined) {
        this.subscribeToSaveResponse(this.eventService.update(event));
      } else {
        this.subscribeToSaveResponse(this.eventService.create(event));
      }
    }
  }

  private createFromForm(): IEvent {
    return {
      ...new Event(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      start: this.editForm.get(['start'])!.value ? moment(this.editForm.get(['start'])!.value, DATE_TIME_FORMAT) : undefined,
      end: this.editForm.get(['end'])!.value ? moment(this.editForm.get(['end'])!.value, DATE_TIME_FORMAT) : undefined,
      limit: this.editForm.get(['limit'])!.value,
      streamLink: this.editForm.get(['streamLink'])!.value,
      streamLinkType: this.editForm.get(['streamLinkType'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      organizer: this.applicationUsers.find(user => user.id === this.editForm.get(['organizerId'])!.value),
      activityId: this.editForm.get(['activityId'])!.value,
      participants: this.editForm.get(['participants'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEvent>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }

  getSelected(selectedVals: IAppUser[], option: IAppUser): IAppUser {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }

  public get linkType(): typeof LinkType {
    return LinkType;
  }
}
