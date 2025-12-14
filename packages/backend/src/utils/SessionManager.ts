import { Request, Response } from 'express';
import { PreconditionFailed } from 'http-errors';

export class SessionManager {
  public static setSession(req: Request, token: string): void {
    if (!req.session) {
      throw new PreconditionFailed(`Invalid or no session`);
    }

    req.session.token = token;
  }

  public static hasValidSession(req: Request, res: Response): string {
    if (!req.session || !req.session.token) {
      res.clearCookie(`spa_token`);
      throw new PreconditionFailed(`Invalid or no session`);
    }

    return req.session.token;
  }

  public static destroy(req: Request): Promise<void> {
    return new Promise((resolve, reject) => {
      delete req.session?.token;

      req.session?.destroy((err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }
}
