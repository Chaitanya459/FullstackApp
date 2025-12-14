/* eslint-disable @typescript-eslint/naming-convention */
import { ILoginToken } from '../../src/types';

declare module 'express-serve-static-core' {
  interface Request {
    reqId: string;
    user: ILoginToken;
  }
}

declare module 'express-session' {
  interface Session {
    token?: string;
  }
}
