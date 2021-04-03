import { Moment } from 'moment';
import { IEvent } from 'app/shared/model/event.model';
import { Sex } from 'app/shared/model/enumerations/sex.model';
import { User } from 'app/core/user/user.model';

export interface IAppUser {
  id?: number;
  sex?: Sex;
  birthDay?: Moment;
  googleToken?: string;
  facebookToken?: string;
  imageContentType?: string;
  image?: any;
  introduction?: string;
  isTrainer?: boolean;
  internalUser?: User;
  events?: IEvent[];
  injury?: string;
  surgery?: string;
  heartProblem?: string;
  respiratoryDisease?: string;
  spineProblem?: string;
  regularPain?: string;
  medicine?: string;
  otherProblem?: string;
  gdprAccepted?: boolean;
  selfResponsibility?: boolean;
}

export class AppUser implements IAppUser {
  constructor(
    public id?: number,
    public sex?: Sex,
    public birthDay?: Moment,
    public googleToken?: string,
    public facebookToken?: string,
    public imageContentType?: string,
    public image?: any,
    public introduction?: string,
    public isTrainer?: boolean,
    public internalUser?: User,
    public events?: IEvent[],
    public injury?: string,
    public surgery?: string,
    public heartProblem?: string,
    public respiratoryDisease?: string,
    public spineProblem?: string,
    public regularPain?: string,
    public medicine?: string,
    public otherProblem?: string,
    public gdprAccepted?: boolean,
    public selfResponsibility?: boolean
  ) {
    this.isTrainer = this.isTrainer || false;
  }
}
