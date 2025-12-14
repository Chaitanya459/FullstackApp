import { EventEmitter } from './EventEmitter';

export * from './DomainEvent';
export * from './EventEmitter';

export const systemEventEmitter = new EventEmitter();
