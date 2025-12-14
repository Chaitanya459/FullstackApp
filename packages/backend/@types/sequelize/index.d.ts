import { ActorId } from '../../src/types';

declare module 'sequelize' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Logging {
    actorId?: ActorId;
  }
}
