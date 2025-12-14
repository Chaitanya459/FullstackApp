import { promisify } from 'util';
import { resolve as resolvePath } from 'node:path';
import appRoot from 'app-root-path';
import { Data, renderFile } from 'ejs';
import config from 'config';

const renderFileAsync: (path: string, data: Data) => Promise<string> = promisify(renderFile);

export const renderEmailTemplate = async (templateName: string, data: Data): Promise<string> => renderFileAsync(
  resolvePath(appRoot.path, `packages`, `backend`, `emailTemplates`, `${templateName}.ejs`), {
    ...data,
    serverUrl: config.get<string>(`server.url`),
  },
);
