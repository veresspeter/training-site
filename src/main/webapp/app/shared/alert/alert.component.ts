import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiAlertService, JhiAlert } from 'ng-jhipster';

@Component({
  selector: 'jhi-alert',
  template: ` <div class="alerts" role="alert">
    <ng-container *ngFor="let alert of alerts; let i = index">
      <div [ngClass]="setClasses(alert)" [style.top.px]="75 + i * 60">
        <ngb-alert *ngIf="alert && alert.type && alert.msg" [type]="alert.type" (close)="close(alert)">
          <fa-icon icon="check-circle"></fa-icon>
          <pre [innerHTML]="alert.msg"></pre>
        </ngb-alert>
      </div>
    </ng-container>
  </div>`,
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: JhiAlert[] = [];

  constructor(private alertService: JhiAlertService) {}

  ngOnInit(): void {
    this.alerts = this.alertService.get();
  }

  setClasses(alert: JhiAlert): { [key: string]: boolean } {
    const classes = { 'jhi-toast': Boolean(alert.toast) };
    if (alert.position) {
      return { ...classes, [alert.position]: true };
    }
    return classes;
  }

  ngOnDestroy(): void {
    this.alertService.clear();
  }

  close(alert: JhiAlert): void {
    // NOSONAR can be removed after https://github.com/SonarSource/SonarJS/issues/1930 is resolved
    alert.close?.(this.alerts); // NOSONAR
  }
}
