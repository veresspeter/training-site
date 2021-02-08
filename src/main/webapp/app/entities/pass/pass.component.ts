import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPass } from 'app/shared/model/pass.model';
import { PassService } from './pass.service';
import { PassDeleteDialogComponent } from './pass-delete-dialog.component';

@Component({
  selector: 'jhi-pass',
  templateUrl: './pass.component.html',
})
export class PassComponent implements OnInit, OnDestroy {
  passes?: IPass[];
  eventSubscriber?: Subscription;

  constructor(protected passService: PassService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.passService.query().subscribe((res: HttpResponse<IPass[]>) => (this.passes = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPasses();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPass): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInPasses(): void {
    this.eventSubscriber = this.eventManager.subscribe('passListModification', () => this.loadAll());
  }

  delete(pass: IPass): void {
    const modalRef = this.modalService.open(PassDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pass = pass;
  }
}
