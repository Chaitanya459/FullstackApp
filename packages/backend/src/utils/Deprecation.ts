import express from 'express';

export function deprecate(newUrl: string) {
  return function(req: express.Request,
    res: express.Response,
    next: express.NextFunction): any {
    res.append(`Deprecation`, `WARNING - this endpoint is deprecated; use ${newUrl} instead`);
    next();
  };
}

export function deprecateWithRedirect(newUrl: string) {
  return function(req: express.Request, res: express.Response): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const _newURL = newUrl.replace(/:([^/]+)/g, (match, p1) => req.params[p1]);
    res.redirect(302, `${_newURL}?redirectTo=${encodeURIComponent(newUrl)}`);
  };
}

export function alreadySunset(newUrl: string) {
  return function(req: express.Request, res: express.Response): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const _newURL = newUrl.replace(/:([^/]+)/g, (match, p1) => req.params[p1]);
    res.status(410).json({
      message: `WARNING - this endpoint is deprecated; use ${newUrl} instead`,
      url: _newURL,
    });
  };
}
