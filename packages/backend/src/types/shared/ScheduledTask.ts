export interface IScheduledTask {
  cronTime: string;
  execute: () => Promise<void> | void;
}
