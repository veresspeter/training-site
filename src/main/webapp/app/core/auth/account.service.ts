import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';
import { StateStorageService } from 'app/core/auth/state-storage.service';

import { SERVER_API_URL } from 'app/app.constants';
import { TrackerService } from '../tracker/tracker.service';
import { AppUser } from 'app/shared/model/application-user.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: AppUser | null = null;
  private authenticationState = new ReplaySubject<AppUser | null>(1);
  private accountCache$?: Observable<AppUser | null>;

  constructor(
    private http: HttpClient,
    private trackerService: TrackerService,
    private stateStorageService: StateStorageService,
    private router: Router
  ) {}

  save(account: AppUser): Observable<{}> {
    return this.http.post(SERVER_API_URL + 'api/account', account);
  }

  authenticate(identity: AppUser | null): void {
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
    /*
    if (identity) {
      this.trackerService.connect();
    } else {
      this.trackerService.disconnect();
    }
     */
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

  identity(force?: boolean): Observable<AppUser | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.fetch().pipe(
        catchError(() => {
          return of(null);
        }),
        tap((appUser: AppUser | null) => {
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

  getAuthenticationState(): Observable<AppUser | null> {
    return this.authenticationState.asObservable();
  }

  getImageUrl(): string {
    return this.userIdentity!.internalUser!.imageUrl ? this.userIdentity!.internalUser!.imageUrl : '';
  }

  private fetch(): Observable<AppUser> {
    return this.http.get<AppUser>(SERVER_API_URL + 'api/account');
  }

  getAgoraToken(channelName: string, timeStamp: string): Observable<string> {
    return this.http.get<string>(SERVER_API_URL + 'api/agora-token', { params: { timeStamp, channelName } });
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
}
