import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPassType } from 'app/shared/model/pass-type.model';

type EntityResponseType = HttpResponse<IPassType>;
type EntityArrayResponseType = HttpResponse<IPassType[]>;

@Injectable({ providedIn: 'root' })
export class PassTypeService {
  public resourceUrl = SERVER_API_URL + 'api/pass-types';

  constructor(protected http: HttpClient) {}

  create(passType: IPassType): Observable<EntityResponseType> {
    return this.http.post<IPassType>(this.resourceUrl, passType, { observe: 'response' });
  }

  update(passType: IPassType): Observable<EntityResponseType> {
    return this.http.put<IPassType>(this.resourceUrl, passType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPassType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPassType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
