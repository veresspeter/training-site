import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPassType } from 'app/shared/model/pass-type.model';
import { PassTypeService } from './pass-type.service';
import { PassTypeDeleteDialogComponent } from './pass-type-delete-dialog.component';

@Component({
  selector: 'jhi-pass-type',
  templateUrl: './pass-type.component.html',
})
export class PassTypeComponent implements OnInit, OnDestroy {
  passTypes?: IPassType[];
  eventSubscriber?: Subscription;

  constructor(protected passTypeService: PassTypeService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.passTypeService.query().subscribe((res: HttpResponse<IPassType[]>) => (this.passTypes = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPassTypes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPassType): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInPassTypes(): void {
    this.eventSubscriber = this.eventManager.subscribe('passTypeListModification', () => this.loadAll());
  }

  delete(passType: IPassType): void {
    const modalRef = this.modalService.open(PassTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.passType = passType;
  }
}
