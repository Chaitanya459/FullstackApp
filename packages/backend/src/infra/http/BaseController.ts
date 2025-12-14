import { NextFunction, Request, Response } from 'express';
import { BadRequest } from 'http-errors';
import { injectable } from 'inversify';
import { z } from 'zod';

@injectable()
export abstract class BaseController {
  protected abstract executeImpl(req: Request, res?: Response): any;

  public constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.execute = this.execute.bind(this);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.executeImpl = this.executeImpl.bind(this);
  }

  protected ok<T>(req: Request, res: Response, dto?: T): Response {
    if (req.query.redirectTo) {
      const redirectTo = typeof req.query.redirectTo === `string` ?
        req.query.redirectTo :
          JSON.stringify(req.query.redirectTo);
      res.append(`Deprecation`, `WARNING - endpoint is deprecated, use ${redirectTo} instead`);
    }

    const statusCode = res.get(`Deprecation`) ? 299 : 200;
    if (dto) {
      return res.status(statusCode).json(dto);
    }
    return res.sendStatus(statusCode);
  }

  protected validateRequest<T>(schema: z.ZodType<T>, data: any): T {
    const parseResult = schema.safeParse(data);

    if (!parseResult.success) {
      throw new BadRequest(JSON.stringify(z.treeifyError(parseResult.error)));
    }

    return parseResult.data;
  }

  public async execute(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await this.executeImpl(req, res);
      if (res.headersSent) {
        return;
      }

      this.ok(req, res, data);
    } catch (error) {
      next(error);
    }
  }
}
