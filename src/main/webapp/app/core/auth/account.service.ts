import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { StateStorageService } from 'app/core/auth/state-storage.service';

import { SERVER_API_URL } from 'app/app.constants';
import { TrackerService } from '../tracker/tracker.service';
import { IAppUser } from 'app/shared/model/application-user.model';
import { IEvent } from 'app/shared/model/event.model';
import { IPass } from 'app/shared/model/pass.model';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: IAppUser | null = null;
  private authenticationState = new ReplaySubject<IAppUser | null>(1);
  private accountCache$?: Observable<IAppUser | null>;

  constructor(
    private http: HttpClient,
    private trackerService: TrackerService,
    private stateStorageService: StateStorageService,
    private router: Router
  ) {}

  save(account: IAppUser): Observable<{}> {
    const copy = this.convertDateFromClient(account);
    return this.http.post(SERVER_API_URL + 'api/account', copy);
  }

  authenticate(identity: IAppUser | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
    if (identity) {
      this.trackerService.connect();
    } else {
      this.trackerService.disconnect();
    }
  }

  hasAnyAuthority(authorities: string[] | string): boolean {
    if (!this.userIdentity || !this.userIdentity.internalUser!.authorities) {
      return false;
    }
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
    }
    return this.userIdentity.internalUser!.authorities.some((authority: string) => authorities.includes(authority));
  }

  identity(force?: boolean): Observable<IAppUser | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.fetch().pipe(
        catchError(() => {
          return of(null);
        }),
        tap((appUser: IAppUser | null) => {
          this.authenticate(appUser);

          if (appUser) {
            this.navigateToStoredUrl();
          }
        }),
        shareReplay()
      );
    }
    return this.accountCache$;
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<IAppUser | null> {
    return this.authenticationState.asObservable();
  }

  getImageUrl(): string {
    return this.userIdentity!.internalUser!.imageUrl ? this.userIdentity!.internalUser!.imageUrl : '';
  }

  private fetch(): Observable<IAppUser> {
    return this.http.get<IAppUser>(SERVER_API_URL + 'api/account').pipe(map((app: IAppUser) => this.convertDateFromServer(app)));
  }

  getAgoraToken(channelName: string, timeStamp: string): Observable<string> {
    return this.http.get<string>(SERVER_API_URL + 'api/agora-token', { params: { timeStamp, channelName } });
  }

  getMyEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(SERVER_API_URL + 'api/account/my-events', {});
  }

  getMyPasses(): Observable<IPass[]> {
    return this.http.get<IPass[]>(SERVER_API_URL + 'api/account/my-passes', {});
  }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }

  protected convertDateFromClient(appUser: IAppUser): IAppUser {
    return Object.assign({}, appUser, {
      start: appUser.birthDay && appUser.birthDay.isValid() ? appUser.birthDay.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(appUser: IAppUser): IAppUser {
    if (appUser) {
      appUser.birthDay = appUser.birthDay ? moment(appUser.birthDay) : undefined;
    }
    return appUser;
  }
}
