import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import './vendor';
import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { MaxmoveCoreModule } from 'app/core/core.module';
import { MaxmoveAppRoutingModule } from './app-routing.module';
import { MaxmoveActivityTypeModule } from './activity-type/activity-type.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';
import { CalendarModule } from './calendar/calendar.module';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  imports: [
    BrowserModule,
    FontAwesomeModule,
    MaxmoveSharedModule,
    MaxmoveCoreModule,
    MaxmoveActivityTypeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    MaxmoveAppRoutingModule,
    CalendarModule,
    NgbModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [MainComponent],
})
export class MaxmoveAppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
