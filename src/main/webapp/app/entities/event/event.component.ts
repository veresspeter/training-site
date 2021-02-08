import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEvent } from 'app/shared/model/event.model';
import { EventService } from './event.service';
import { EventDeleteDialogComponent } from './event-delete-dialog.component';

@Component({
  selector: 'jhi-event',
  templateUrl: './event.component.html',
})
export class EventComponent implements OnInit, OnDestroy {
  events?: IEvent[];
  eventSubscriber?: Subscription;

  constructor(protected eventService: EventService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.eventService.query().subscribe((res: HttpResponse<IEvent[]>) => (this.events = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInEvents();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IEvent): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInEvents(): void {
    this.eventSubscriber = this.eventManager.subscribe('eventListModification', () => this.loadAll());
  }

  delete(event: IEvent): void {
    const modalRef = this.modalService.open(EventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.event = event;
  }
}
