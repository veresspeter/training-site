import { Moment } from 'moment';
import { PaymentStatus } from 'app/shared/model/enumerations/payment-status.model';

export interface IPass {
  id?: number;
  purchased?: Moment;
  usageNo?: number;
  validFrom?: Moment;
  validTo?: Moment;
  passTypeId?: number;
  userId?: number;
  paymentId?: string;
  paymentStatus?: PaymentStatus;
  paymentBarionStatus?: string;
  paymentBarionTimestamp?: Moment;
}

export class Pass implements IPass {
  constructor(
    public id?: number,
    public purchased?: Moment,
    public usageNo?: number,
    public validFrom?: Moment,
    public validTo?: Moment,
    public passTypeId?: number,
    public userId?: number,
    public paymentId?: string,
    public paymentStatus?: PaymentStatus,
    public paymentBarionStatus?: string,
    public paymentBarionTimestamp?: Moment
  ) {}
}
