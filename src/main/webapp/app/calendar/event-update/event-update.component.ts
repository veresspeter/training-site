import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IEvent, Event } from 'app/shared/model/event.model';
import { EventService } from 'app/shared/services/event.service';
import { IApplicationUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { IActivity } from 'app/shared/model/activity.model';
import { ActivityService } from 'app/shared/services/activity.service';

type SelectableEntity = IApplicationUser | IActivity;

@Component({
  selector: 'jhi-event-update',
  templateUrl: './event-update.component.html',
})
export class EventUpdateComponent implements OnInit {
  isSaving = false;
  applicationUsers: IApplicationUser[] = [];
  activities: IActivity[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    start: [null, [Validators.required]],
    end: [null, [Validators.required]],
    limit: [],
    streamLink: [],
    streamLinkType: [],
    comment: [],
    organizerId: [null, Validators.required],
    activityId: [null, Validators.required],
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

      this.applicationUserService.query().subscribe((res: HttpResponse<IApplicationUser[]>) => (this.applicationUsers = res.body || []));

      this.activityService.query().subscribe((res: HttpResponse<IActivity[]>) => (this.activities = res.body || []));
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
      streamLinkType: event.streamLinkType || 'ZOOM',
      comment: event.comment,
      organizerId: event.organizer?.id,
      activityId: event.activityId,
      participants: event.participants,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const event = this.createFromForm();
    if (event.id !== undefined) {
      this.subscribeToSaveResponse(this.eventService.update(event));
    } else {
      this.subscribeToSaveResponse(this.eventService.create(event));
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

  getSelected(selectedVals: IApplicationUser[], option: IApplicationUser): IApplicationUser {
    if (selectedVals) {
      for (let i = 0; i < selectedVals.length; i++) {
        if (option.id === selectedVals[i].id) {
          return selectedVals[i];
        }
      }
    }
    return option;
  }
}
