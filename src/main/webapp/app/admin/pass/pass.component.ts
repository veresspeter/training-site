import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { combineLatest, Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Pass } from 'app/shared/model/pass.model';
import { PassDeleteDialogComponent } from './pass-delete/pass-delete-dialog.component';
import { ITEMS_PER_PAGE } from 'app/shared/constants/pagination.constants';
import { PassService } from 'app/shared/services/pass.service';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'jhi-pass',
  templateUrl: './pass.component.html',
})
export class PassComponent implements OnInit, OnDestroy {
  passes: Pass[] | null = null;
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;

  constructor(
    protected passService: PassService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventSubscriber = this.eventManager.subscribe('passListModification', () => this.loadAll());
    this.handleNavigation();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: Pass): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  delete(pass: Pass): void {
    const modalRef = this.modalService.open(PassDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.pass = pass;
  }

  transition(): void {
    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute.parent,
      queryParams: {
        page: this.page,
        sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
      },
    });
  }

  private handleNavigation(): void {
    combineLatest(this.activatedRoute.data, this.activatedRoute.queryParamMap, (data: Data, params: ParamMap) => {
      const page = params.get('page');
      this.page = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      this.predicate = sort[0];
      this.ascending = sort[1] === 'asc';
      this.loadAll();
    }).subscribe();
  }

  private loadAll(): void {
    this.passService
      .query({
        page: this.page - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe((res: HttpResponse<Pass[]>) => this.onSuccess(res.body, res.headers));
  }

  private sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  private onSuccess(passes: Pass[] | null, headers: HttpHeaders): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.passes = passes;
  }
}
