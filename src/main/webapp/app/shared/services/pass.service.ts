import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPass } from 'app/shared/model/pass.model';

type EntityResponseType = HttpResponse<IPass>;
type EntityArrayResponseType = HttpResponse<IPass[]>;

@Injectable({ providedIn: 'root' })
export class PassService {
  public resourceUrl = SERVER_API_URL + 'api/passes';

  constructor(protected http: HttpClient) {}

  create(pass: IPass): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pass);
    return this.http
      .post<IPass>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(pass: IPass): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pass);
    return this.http
      .put<IPass>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPass>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPass[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  purchase(passTypeId: number): Observable<HttpResponse<string>> {
    return this.http.post<string>(`${this.resourceUrl}/purchase`, passTypeId, { observe: 'response' });
  }

  check(paymentId: string): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.resourceUrl}/payment-callback`, paymentId, { observe: 'response' });
  }

  protected convertDateFromClient(pass: IPass): IPass {
    const copy: IPass = Object.assign({}, pass, {
      purchased: pass.purchased && pass.purchased.isValid() ? pass.purchased.format(DATE_FORMAT) : undefined,
      validFrom: pass.validFrom && pass.validFrom.isValid() ? pass.validFrom.format(DATE_FORMAT) : undefined,
      validTo: pass.validTo && pass.validTo.isValid() ? pass.validTo.format(DATE_FORMAT) : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.purchased = res.body.purchased ? moment(res.body.purchased) : undefined;
      res.body.validFrom = res.body.validFrom ? moment(res.body.validFrom) : undefined;
      res.body.validTo = res.body.validTo ? moment(res.body.validTo) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((pass: IPass) => {
        pass.purchased = pass.purchased ? moment(pass.purchased) : undefined;
        pass.validFrom = pass.validFrom ? moment(pass.validFrom) : undefined;
        pass.validTo = pass.validTo ? moment(pass.validTo) : undefined;
      });
    }
    return res;
  }
}
