import { Moment } from 'moment';
import { IAppUser } from 'app/shared/model/application-user.model';
import { LinkType } from 'app/shared/model/enumerations/link-type.model';

export interface IEvent {
  id?: number;
  name?: string;
  start?: Moment;
  end?: Moment;
  limit?: number;
  streamLink?: string;
  streamLinkType?: LinkType;
  zoomRoomNo?: string;
  zoomRoomPsw?: string;
  zoomStartLink?: string;
  comment?: string;
  organizer?: IAppUser;
  activityId?: number;
  participants?: IAppUser[];
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
    public zoomRoomNo?: string,
    public zoomRoomPsw?: string,
    public zoomStartLink?: string,
    public comment?: string,
    public organizer?: IAppUser,
    public activityId?: number,
    public participants?: IAppUser[]
  ) {}
}
