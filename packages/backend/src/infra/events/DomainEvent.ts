import _EventEmitter from 'events';
import { IDomainEvent } from 'types';

export abstract class DomainEvent<T = any> implements IDomainEvent<T> {
  public occurrenceTime: Date;

  public constructor(public readonly eventData: T) {
    this.occurrenceTime = new Date();
  }
}
