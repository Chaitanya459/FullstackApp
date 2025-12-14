import { IAction, ISubject } from '../..';

export interface IPermission {
  id: number;
  action?: IAction;
  actionId: number;
  inverted: boolean;

  subject?: ISubject;
  subjectId: number;
}
