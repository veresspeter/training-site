import './vendor';
import { TrainingsiteSharedModule } from 'app/shared/shared.module';
import { TrainingsiteCoreModule } from 'app/core/core.module';
import { TrainingsiteAppRoutingModule } from './app-routing.module';
import { TrainingsiteActivityTypeModule } from './activity-type/activity-type.module';
import 'cookieconsent/build/cookieconsent.min';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';
import { CalendarModule } from './calendar/calendar.module';
import { AccountService } from 'app/core/auth/account.service';
import { ApplicationUserService } from 'app/shared/services/application-user.service';
import { GdprComponent } from './gdpr/gdpr.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleTagManagerModule, GoogleTagManagerService } from 'angular-google-tag-manager';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { NgModule, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    TrainingsiteSharedModule,
    TrainingsiteCoreModule,
    TrainingsiteActivityTypeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    TrainingsiteAppRoutingModule,
    CalendarModule,
    NgbModule,
    GoogleTagManagerModule.forRoot({
      id: 'GTM-N9SD87Z',
    }),
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent, GdprComponent],
  bootstrap: [MainComponent],
})
export class TrainingsiteAppModule implements OnDestroy {
  private endSubscriptions: Subject<void> = new Subject<void>();

  constructor(
    library: FaIconLibrary,
    router: Router,
    accountService: AccountService,
    applicationUserService: ApplicationUserService,
    protected gtmService: GoogleTagManagerService
  ) {
    this.gtmService.addGtmToDom();

    library.addIconPacks(fas, fab);

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        accountService.identity().subscribe(account => {
          if (account !== null && account.internalUser!.id !== null) {
            applicationUserService.findByInternalId(account.internalUser!.id).subscribe(res => {
              if (
                !res.body!.internalUser!.lastName ||
                !res.body!.internalUser!.firstName ||
                !res.body!.birthDay ||
                !res.body!.sex ||
                !res.body!.internalUser!.email ||
                !res.body!.injury ||
                !res.body!.surgery ||
                !res.body!.heartProblem ||
                !res.body!.respiratoryDisease ||
                !res.body!.spineProblem ||
                !res.body!.regularPain ||
                !res.body!.medicine ||
                !res.body!.otherProblem ||
                !res.body!.gdprAccepted ||
                !res.body!.selfResponsibility
              ) {
                router.navigate(['/account/settings']);
              }
            });
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.endSubscriptions.next();
    this.endSubscriptions.complete();
  }
}
