import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { NgcCookieConsentConfig } from 'ngx-cookieconsent';

export const COOKIE_CONFIG: NgcCookieConsentConfig = {
  cookie: {
    domain: DEBUG_INFO_ENABLED ? 'localhost' : 'trainingsite.hu', // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  palette: {
    popup: {
      background: '#f5e1da',
    },
    button: {
      background: '#e17f3d',
    },
  },
  theme: 'edgeless',
  type: 'opt-out',
};
