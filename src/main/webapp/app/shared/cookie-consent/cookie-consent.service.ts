import { Injectable } from '@angular/core';
import { NgcContentOptions, NgcCookieConsentService } from 'ngx-cookieconsent';

@Injectable()
export class JhiCookieConsentService {
  constructor(private ngcCookieConsentService: NgcCookieConsentService) {}

  updateCookieConsentContent(content?: NgcContentOptions): void {
    const config = this.ngcCookieConsentService.getConfig();
    const configContent = config.content ?? {};
    config.content = { ...configContent, ...content };
    this.ngcCookieConsentService.destroy();
    this.ngcCookieConsentService.init({ ...config });
  }
}
