import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import './vendor';
import { MaxmoveSharedModule } from 'app/shared/shared.module';
import { MaxmoveCoreModule } from 'app/core/core.module';
import { MaxmoveAppRoutingModule } from './app-routing.module';
import { MaxmoveHomeModule } from './home/home.module';
import { MaxmoveEntityModule } from './entities/entity.module';
// jhipster-needle-angular-add-module-import JHipster will add new module here
import { MainComponent } from './layouts/main/main.component';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { PageRibbonComponent } from './layouts/profiles/page-ribbon.component';
import { ErrorComponent } from './layouts/error/error.component';
import { CalendarModule } from './calendar/calendar.module';

@NgModule({
  imports: [
    BrowserModule,
    MaxmoveSharedModule,
    MaxmoveCoreModule,
    MaxmoveHomeModule,
    // jhipster-needle-angular-add-module JHipster will add new module here
    MaxmoveEntityModule,
    MaxmoveAppRoutingModule,
    CalendarModule,
  ],
  declarations: [MainComponent, NavbarComponent, ErrorComponent, PageRibbonComponent, FooterComponent],
  bootstrap: [MainComponent],
})
export class MaxmoveAppModule {}
