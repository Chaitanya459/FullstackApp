import path from 'path';
import fse from 'fs-extra';
import appRootPath from 'app-root-path';

fse.emptyDirSync(path.join(appRootPath.path, `packages`, `client`, `public`, `tinymce`));
fse.copySync(
  path.join(appRootPath.path, `node_modules`, `tinymce`),
  path.join(appRootPath.path, `packages`, `client`, `public`, `tinymce`),
  { overwrite: true },
);
