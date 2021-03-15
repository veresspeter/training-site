import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { IAppUser } from 'app/shared/model/application-user.model';
import { ApplicationUserService } from 'app/shared/services/application-user.service';

@Component({
  selector: 'jhi-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.scss'],
})
export class TrainerComponent implements OnInit, OnDestroy {
  applicationUsers?: IAppUser[];
  eventSubscriber?: Subscription;
  loading = true;

  constructor(
    protected applicationUserService: ApplicationUserService,
    protected dataUtils: JhiDataUtils,
    protected eventManager: JhiEventManager,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.applicationUserService.queryTrainers({}).subscribe((res: HttpResponse<IAppUser[]>) => {
      this.applicationUsers = res.body || [];
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(() => {
      this.loadAll();
    });
    this.registerChangeInActivities();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IAppUser): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(contentType = '', base64String: string): void {
    return this.dataUtils.openFile(contentType, base64String);
  }

  registerChangeInActivities(): void {
    this.eventSubscriber = this.eventManager.subscribe('trainerModification', () => this.loadAll());
  }
}
