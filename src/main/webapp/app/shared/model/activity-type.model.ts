export interface IActivityType {
  id?: number;
  name?: string;
  imageUrl?: string;
}

export class ActivityType implements IActivityType {
  constructor(public id?: number, public name?: string, public imageUrl?: string) {}
}
