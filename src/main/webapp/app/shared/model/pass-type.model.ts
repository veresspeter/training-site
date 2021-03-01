import { IActivityType } from 'app/shared/model/activity-type.model';

export interface IPassType {
  id?: number;
  name?: string;
  description?: string;
  durationDays?: number;
  price?: string;
  occasions?: number;
  availableForType?: IActivityType;
  availableForActivityId?: number;
}

export class PassType implements IPassType {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public durationDays?: number,
    public price?: string,
    public occasions?: number,
    public availableForType?: IActivityType,
    public availableForActivityId?: number
  ) {}
}
