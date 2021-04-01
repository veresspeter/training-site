import { Moment } from 'moment';

export interface IPass {
  id?: number;
  purchased?: Moment;
  usageNo?: number;
  validFrom?: Moment;
  validTo?: Moment;
  passTypeId?: number;
  userId?: number;
  paymentId?: string;
  paymentStatus?: string;
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
    public paymentStatus?: string,
    public paymentBarionStatus?: string,
    public paymentBarionTimestamp?: Moment
  ) {}
}
