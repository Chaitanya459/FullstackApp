import 'reflect-metadata';
import createError from 'http-errors';
import { ITokenService } from '../modules/user/services/TokenService';
import * as generate from '../../test/utils/generate';
import { container } from '../infra/di/inversify.config';
import { Shield } from './Shield';

// eslint-disable-next-line @stylistic/quotes
jest.mock(`redis`, () => jest.requireActual<typeof import('redis')>(`redis-mock`));
jest.mock(`../infra/di/inversify.config`, () => ({
  container: {
    get: jest.fn().mockReturnValue(generate.mockServices.tokenService),
  },
}));

describe(`Shield Middleware`, () => {
  const fakeUser = generate.buildUser();
  const tokenServiceMock = container.get<ITokenService>(ITokenService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`works when it has a session`, async () => {
    tokenServiceMock.verify = jest.fn().mockReturnValue(fakeUser);

    const req = generate.buildAuthenticatedReq();
    const res = generate.buildRes();
    const next = generate.buildNext();

    await Shield(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual(fakeUser);
  });

  it(`throws a PreconditionFailed Error when no session is provided`, async () => {
    const req = generate.buildUnAuthenticatedReq();
    const res = generate.buildRes();
    const next = generate.buildNext();
    const error = new createError.PreconditionFailed(`Invalid or no session`);

    await Shield(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
