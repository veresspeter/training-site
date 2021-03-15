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
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { AppUser } from 'app/shared/model/application-user.model';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { PassType } from 'app/shared/model/pass-type.model';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'jhi-pass',
  templateUrl: './pass.component.html',
})
export class PassComponent implements OnInit, OnDestroy {
  passes: Pass[] | null = null;
  appUsers: AppUser[] | null = null;
  passTypes: PassType[] | null = null;
  eventSubscriber?: Subscription;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page!: number;
  predicate!: string;
  ascending!: boolean;
  loading = true;

  constructor(
    protected passService: PassService,
    protected appUserService: ApplicationUserService,
    protected passTypeService: PassTypeService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.eventSubscriber = this.eventManager.subscribe('passListModification', () => this.loadAll());
    this.appUserService.query().subscribe(res => (this.appUsers = res.body || []));
    this.passTypeService.query().subscribe(res => (this.passTypes = res.body || []));
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
    this.loading = false;
  }

  getUserNameById(id: number | undefined): string {
    const result = this.appUsers?.find(appUser => appUser.id === id);
    return result?.internalUser?.lastName + ' ' + result?.internalUser?.firstName;
  }

  getPassTypeNameById(id: number | undefined): string {
    const result = this.passTypes?.find(passType => passType.id === id);
    return `${result?.name} (${result?.price ? formatNumber(result.price, 'hu', '1.0') : '?'} ${result?.unit})`;
  }

  getPassOccasionsById(id: number | undefined): string {
    const result = this.passTypes?.find(passType => passType.id === id);
    return result?.occasions?.toString() || '?';
  }
}
