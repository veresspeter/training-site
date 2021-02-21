export interface IActivity {
  id?: number;
  name?: string;
  description?: string;
  imageContentType?: string;
  image?: any;
  activityTypeId?: number;
}

export class Activity implements IActivity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public imageContentType?: string,
    public image?: any,
    public activityTypeId?: number
  ) {}
}
