import { IAppUser } from 'app/shared/model/application-user.model';

export interface IActivity {
  id?: number;
  name?: string;
  description?: string;
  imageContentType?: string;
  image?: any;
  activityTypeId?: number;
  externalLink?: string;
  trainer?: IAppUser;
}

export class Activity implements IActivity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public imageContentType?: string,
    public image?: any,
    public activityTypeId?: number,
    public externalLink?: string,
    public trainer?: IAppUser
  ) {}
}
