import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { z } from 'zod';
import { BaseController } from './BaseController';

export interface IFile {
  content: Buffer;
  mimetype: string;
  name: string;
}

@injectable()
export abstract class FileDownloadController extends BaseController {
  protected abstract executeImpl(req: Request, res?: Response): IFile | Promise<IFile>;

  public constructor() {
    super();
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
    const fileSchema = z.object({
      content: z.instanceof(Buffer),
      mimetype: z.string(),
      name: z.string(),
    });

    const file = this.validateRequest<IFile>(fileSchema, dto);

    const statusCode = res.get(`Deprecation`) ? 299 : 200;

    res.status(statusCode);
    res.set({
      'Content-Disposition': `attachment; filename="${file.name}"`,
      'Content-Length': String(file.content.length),
      'Content-Type': file.mimetype,
    });

    return res.send(file.content);
  }
}
