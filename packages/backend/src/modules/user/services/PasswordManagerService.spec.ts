import 'reflect-metadata';
import cases from 'jest-in-case';
import { PasswordManagerService } from './PasswordManagerService';

function casify(obj: { [key: string]: string }) {
  return Object.entries(obj).map(([ name, password ]) => ({
    name: `${password} - ${name}`,
    password,
  }));
}

const passwordManagerService = new PasswordManagerService();

describe(`PasswordManager`, () => {
  describe(`PasswordManager.isSecure`, () => {
    cases(
      `isPasswordAllowed: valid passwords`,
      ({ password }) => {
        expect(passwordManagerService.isSecure(password)).toBe(true);
      },
      casify({ 'valid password': `!aBc4567&9` }),
    );

    cases(
      `isPasswordAllowed: invalid passwords`,
      ({ password }) => {
        expect(passwordManagerService.isSecure(password)).toEqual(expect.arrayContaining([ expect.any(String) ]));
      },
      casify({
        'no letters': `123456!`,
        'no lowercase letters': `ABC123!`,
        'no non-alphanumeric characters': `ABCdef123`,
        'no numbers': `ABCdef!`,
        'no uppercase letters': `abc123!`,
        'too short': `aBc4567&9`,
      }),
    );
  });

  describe(`PasswordManagerService.[hash, verify]Password`, () => {
    it(`hashes and verifies the password`, async () => {
      const clearPassword = `password`;
      const hashedPassword = await passwordManagerService.hashPassword(`password`);
      expect(hashedPassword).not.toEqual(`password`);

      await expect(
        passwordManagerService.verifyPassword(clearPassword, hashedPassword),
      ).resolves.toBe(true);
    });

    it(`fails to verify a password not properly hashed`, async () => {
      await expect(
        passwordManagerService.verifyPassword(`somePassword`, `notARealHash`),
      ).resolves.toBe(false);
    });
  });

  describe(`PasswordManagerService.createRandomPassword`, () => {
    it(`creates a random password and hashes it (length 10)`, async () => {
      const result = await passwordManagerService.createRandomPassword(10);

      expect(result).toHaveProperty(`password`);
      expect(result).toHaveProperty(`hash`);
      expect(result.password).toHaveLength(10);
      expect(result.hash).not.toEqual(result.password);
    });

    it(`creates a random password and hashes it (length 24)`, async () => {
      const result = await passwordManagerService.createRandomPassword(24);

      expect(result).toHaveProperty(`password`);
      expect(result).toHaveProperty(`hash`);
      expect(result.password).toHaveLength(24);
      expect(result.hash).not.toEqual(result.password);
    });

    it(`creates a random password and hashes it (length 36)`, async () => {
      const result = await passwordManagerService.createRandomPassword(36);

      expect(result).toHaveProperty(`password`);
      expect(result).toHaveProperty(`hash`);
      expect(result.password).toHaveLength(36);
      expect(result.hash).not.toEqual(result.password);
    });
  });
});
