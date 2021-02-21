export interface IActivityType {
  id?: number;
  name?: string;
  imageContentType?: string;
  image?: any;
}

export class ActivityType implements IActivityType {
  constructor(public id?: number, public name?: string, public imageContentType?: string, public image?: any) {}
}
