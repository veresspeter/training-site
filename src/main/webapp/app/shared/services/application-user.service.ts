import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IAppUser } from 'app/shared/model/application-user.model';

type EntityResponseType = HttpResponse<IAppUser>;
type EntityArrayResponseType = HttpResponse<IAppUser[]>;

@Injectable({ providedIn: 'root' })
export class ApplicationUserService {
  public resourceUrl = SERVER_API_URL + 'api/application-users';
  public trainerResourceUrl = SERVER_API_URL + 'api/trainers';

  constructor(protected http: HttpClient) {}

  create(applicationUser: IAppUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationUser);
    return this.http
      .post<IAppUser>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(applicationUser: IAppUser): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicationUser);
    return this.http
      .put<IAppUser>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAppUser>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByInternalId(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAppUser>(`${this.resourceUrl}/internal-id/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAppUser[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryTrainers(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAppUser[]>(this.trainerResourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(applicationUser: IAppUser): IAppUser {
    const copy: IAppUser = Object.assign({}, applicationUser, {
      birthDay: applicationUser.birthDay && applicationUser.birthDay.isValid() ? applicationUser.birthDay.format(DATE_FORMAT) : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.birthDay = res.body.birthDay ? moment(res.body.birthDay) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((applicationUser: IAppUser) => {
        applicationUser.birthDay = applicationUser.birthDay ? moment(applicationUser.birthDay) : undefined;
      });
    }
    return res;
  }
}
