import { faker } from '@faker-js/faker';
import { getMockReq, getMockRes } from '@jest-mock/express';

import { IRole, IUser } from 'types';
import { ITokenService } from '../../src/modules/user/services/TokenService';

function buildUnAuthenticatedReq() {
  return getMockReq();
}
function buildAuthenticatedReq() {
  return getMockReq({ session: { token: faker.string.alphanumeric() } });
}

function buildRes() {
  const { res } = getMockRes();
  return res;
}

function buildNext() {
  const { next } = getMockRes();
  return next;
}

function buildUser({ ...overrides }: Partial<IUser> = {}): IUser {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.number.int(),
    createdAt: new Date(),
    createdBy: faker.number.int(),
    deletedAt: null,
    deletedBy: null,
    email: faker.internet.email(),
    firstName,
    lastName,
    lockedAt: null,
    loginAttempts: null,
    name: `${firstName} ${lastName}`,
    password: faker.internet.password(),
    updatedAt: new Date(),
    updatedBy: faker.number.int(),
    ...overrides,
  };
}

function buildRoles({ ...overrides }: Partial<IRole> = {}): IRole[] {
  return [{
    id: faker.number.int(),
    code: faker.person.jobType().toUpperCase(),
    name: faker.person.jobType(),
    ...overrides,
  }];
}

function buildUserWithRoles(user: IUser, roleOverrides: Partial<IRole> = {}): IUser {
  return {
    ...user,
    roles: buildRoles(roleOverrides),
  };
}

function buildUserResponse(user: IUser) {
  return {
    ...user,
    deletedAt: null,
    deletedBy: null,
    updatedAt: null,
    updatedBy: null,
  };
}

const mockServices = {
  tokenService: jest.fn<ITokenService, []>(() => ({
    generatePasswordResetToken: jest.fn().mockName(`TokenService.generatePasswordResetToken`),
    generateToken: jest.fn().mockName(`TokenService.generateToken`),
    verify: jest.fn().mockName(`TokenService.decode`),
  })),
};

export {
  buildAuthenticatedReq,
  buildNext,
  buildRes,
  buildUnAuthenticatedReq,
  buildUser,
  buildUserResponse,
  buildUserWithRoles,
  mockServices,
};
