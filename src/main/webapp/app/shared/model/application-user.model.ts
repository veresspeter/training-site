import { Moment } from 'moment';
import { IEvent } from 'app/shared/model/event.model';
import { Sex } from 'app/shared/model/enumerations/sex.model';

export interface IApplicationUser {
  id?: number;
  credit?: number;
  sex?: Sex;
  birthDay?: Moment;
  googleToken?: string;
  facebookToken?: string;
  imageContentType?: string;
  image?: any;
  introduction?: string;
  internalUserId?: number;
  events?: IEvent[];
}

export class ApplicationUser implements IApplicationUser {
  constructor(
    public id?: number,
    public credit?: number,
    public sex?: Sex,
    public birthDay?: Moment,
    public googleToken?: string,
    public facebookToken?: string,
    public imageContentType?: string,
    public image?: any,
    public introduction?: string,
    public internalUserId?: number,
    public events?: IEvent[]
  ) {}
}
