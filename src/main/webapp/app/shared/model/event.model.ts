import { Moment } from 'moment';
import { IApplicationUser } from 'app/shared/model/application-user.model';
import { LinkType } from 'app/shared/model/enumerations/link-type.model';

export interface IEvent {
  id?: number;
  name?: string;
  start?: Moment;
  end?: Moment;
  limit?: number;
  streamLink?: string;
  streamLinkType?: LinkType;
  comment?: string;
  organizerId?: number;
  activityId?: number;
  participants?: IApplicationUser[];
}

export class Event implements IEvent {
  constructor(
    public id?: number,
    public name?: string,
    public start?: Moment,
    public end?: Moment,
    public limit?: number,
    public streamLink?: string,
    public streamLinkType?: LinkType,
    public comment?: string,
    public organizerId?: number,
    public activityId?: number,
    public participants?: IApplicationUser[]
  ) {}
}
