import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IActivityType } from 'app/shared/model/activity-type.model';

type EntityResponseType = HttpResponse<IActivityType>;
type EntityArrayResponseType = HttpResponse<IActivityType[]>;

@Injectable({ providedIn: 'root' })
export class ActivityTypeService {
  public resourceUrl = SERVER_API_URL + 'api/activity-types';

  constructor(protected http: HttpClient) {}

  create(activityType: IActivityType): Observable<EntityResponseType> {
    return this.http.post<IActivityType>(this.resourceUrl, activityType, { observe: 'response' });
  }

  update(activityType: IActivityType): Observable<EntityResponseType> {
    return this.http.put<IActivityType>(this.resourceUrl, activityType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActivityType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActivityType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
