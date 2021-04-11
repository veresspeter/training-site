import { Component, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { JhiEventManager, JhiAlert, JhiAlertService, JhiEventWithContent } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { AlertError } from './alert-error.model';

@Component({
  selector: 'jhi-alert-error',
  template: ` <div class="alerts" role="alert">
    <ng-container *ngFor="let alert of alerts; let i = index">
      <div [ngClass]="setClasses(alert)" [style.top.px]="75 + i * 60">
        <ngb-alert *ngIf="alert && alert.type && alert.msg" [type]="alert.type" (close)="close(alert)">
          <fa-icon icon="exclamation-circle"></fa-icon>
          <pre [innerHTML]="alert.msg"></pre>
        </ngb-alert>
      </div>
    </ng-container>
  </div>`,
})
export class AlertErrorComponent implements OnDestroy {
  alerts: JhiAlert[] = [];
  errorListener: Subscription;
  httpErrorListener: Subscription;

  constructor(private alertService: JhiAlertService, private eventManager: JhiEventManager) {
    this.errorListener = eventManager.subscribe('maxmoveApp.error', (response: JhiEventWithContent<AlertError>) => {
      const errorResponse = response.content;
      this.addErrorAlert(errorResponse.message);
    });

    this.httpErrorListener = eventManager.subscribe('maxmoveApp.httpError', (response: JhiEventWithContent<HttpErrorResponse>) => {
      const httpErrorResponse = response.content;
      switch (httpErrorResponse.status) {
        // connection refused, server not reachable
        case 0:
          this.addErrorAlert('A szerver nem elérhető');
          break;

        case 400: {
          const arr = httpErrorResponse.headers.keys();
          let errorHeader = null;
          arr.forEach(entry => {
            if (entry.toLowerCase().endsWith('app-error')) {
              errorHeader = httpErrorResponse.headers.get(entry);
            }
          });
          if (errorHeader) {
            this.addErrorAlert(errorHeader);
          } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.fieldErrors) {
            const fieldErrors = httpErrorResponse.error.fieldErrors;
            for (const fieldError of fieldErrors) {
              if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
                fieldError.message = 'Size';
              }
              // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
              const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
              const fieldName = convertedField.charAt(0).toUpperCase() + convertedField.slice(1);
              this.addErrorAlert('Hibás "' + fieldName + '" mező érték');
            }
          } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
            this.addErrorAlert(httpErrorResponse.error.message);
          } else {
            this.addErrorAlert(httpErrorResponse.error);
          }
          break;
        }

        case 401:
          this.addErrorAlert('Bejelentkezés szükséges');
          break;

        case 403:
          this.addErrorAlert('Tartalom nem kérhető');
          break;

        case 404:
          this.addErrorAlert('A keresett oldal nem található');
          break;

        case 500:
          this.addErrorAlert('Szerver hiba');
          break;

        default:
          if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
            this.addErrorAlert(httpErrorResponse.error.message);
          } else {
            this.addErrorAlert(httpErrorResponse.error);
          }
      }
    });
  }

  setClasses(alert: JhiAlert): { [key: string]: boolean } {
    const classes = { 'jhi-toast': Boolean(alert.toast) };
    if (alert.position) {
      return { ...classes, [alert.position]: true };
    }
    return classes;
  }

  ngOnDestroy(): void {
    if (this.errorListener) {
      this.eventManager.destroy(this.errorListener);
    }
    if (this.httpErrorListener) {
      this.eventManager.destroy(this.httpErrorListener);
    }
  }

  addErrorAlert(message: string): void {
    // eslint-disable-next-line no-console
    console.log('addErrorAlert');
    // eslint-disable-next-line no-console
    console.log(message);

    const newAlert: JhiAlert = {
      type: 'danger',
      msg: message,
      timeout: 5000,
      toast: this.alertService.isToast(),
      scoped: true,
    };

    this.alerts.push(this.alertService.addAlert(newAlert, this.alerts));
  }

  close(alert: JhiAlert): void {
    // NOSONAR can be removed after https://github.com/SonarSource/SonarJS/issues/1930 is resolved
    alert.close?.(this.alerts); // NOSONAR
  }
}
