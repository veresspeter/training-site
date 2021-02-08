export interface IActivity {
  id?: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  activityTypeId?: number;
}

export class Activity implements IActivity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public imageUrl?: string,
    public activityTypeId?: number
  ) {}
}
