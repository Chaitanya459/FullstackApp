export interface IDomainEvent<T = any> {
  eventData: T;
  occurrenceTime: Date;
}
