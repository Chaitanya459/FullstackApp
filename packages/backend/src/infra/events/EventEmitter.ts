import _EventEmitter from 'events';
import { logger } from '../../utils';
import { DomainEvent } from '.';

export class EventEmitter extends _EventEmitter {
  public subscribe = <E extends DomainEvent>(event: new (...args: any[]) => E, callback: (e: E) => void) => {
    logger.silly(`🎫 ${callback.name} subscribed to ${event.name}`);
    return super.on(event.name, callback);
  };

  public publish = <E extends DomainEvent>(event: E) => {
    logger.info(`📣 ${event.constructor.name} published`);
    return super.emit(event.constructor.name, event);
  };
}
