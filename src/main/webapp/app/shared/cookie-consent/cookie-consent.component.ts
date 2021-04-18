import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiCookieConsentService } from 'app/shared/cookie-consent/cookie-consent.service';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subject } from 'rxjs';

@Component({
  selector: 'jhi-cookie-consent',
  template: '<!--jhi-cookie-consent-->',
})
export class JhiCookieConsentComponent implements OnInit, OnDestroy {
  private endSubscriptions: Subject<void> = new Subject<void>();

  constructor(private ngcCookieConsentService: NgcCookieConsentService, private cookieConsentService: JhiCookieConsentService) {}

  ngOnInit(): void {
    this.updateCookieConsentOnLanguageChange();
  }

  ngOnDestroy(): void {
    this.endSubscriptions.next();
    this.endSubscriptions.complete();
  }

  private updateCookieConsentOnLanguageChange(): void {
    this.cookieConsentService.updateCookieConsentContent({
      message: 'Weboldalunk sütiket használ, hogy a biztonságos böngészés mellett a legjobb felhasználói élményt nyújtsuk.',
      deny: undefined,
      allow: 'Megértettem',
      href: './gdpr',
      link: 'GDPR oldalunk',
      policy: 'Adatvédelem',
    });
  }
}
