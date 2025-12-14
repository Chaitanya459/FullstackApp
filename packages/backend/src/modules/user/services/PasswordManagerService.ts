import { BadRequest } from 'http-errors';
import { compare, hash } from 'bcrypt';
import { generate as generatePassword } from 'generate-password';
import owasp from 'owasp-password-strength-test';
import { injectable } from 'inversify';

owasp.config({
  allowPassphrases: true,
  maxLength: 128,
  minLength: 10,
  minOptionalTestsToPass: 3,
  minPhraseLength: 20,
});

const PASSWORD_SALT_ROUNDS = 10;

export interface IPasswordManagerService {
  createRandomPassword(length: number): Promise<{ hash: string, password: string }>;
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hashString: string): Promise<boolean>;
  isSecure(password: string): boolean | string[];
  checkPassword(password: string): void;
}
export const IPasswordManagerService = Symbol.for(`IPasswordManagerService`);

@injectable()
export class PasswordManagerService implements IPasswordManagerService {
  public async createRandomPassword(length: number): Promise<{ hash: string, password: string }> {
    const password = generatePassword({ length, numbers: true });
    const hashedPassword = await this.hashPassword(password);
    return { hash: hashedPassword, password };
  }

  public hashPassword(password: string): Promise<string> {
    return hash(password, PASSWORD_SALT_ROUNDS);
  }

  public verifyPassword(password: string, hashString: string): Promise<boolean> {
    return compare(password, hashString);
  }

  public isSecure(password: string): boolean | string[] {
    const res = owasp.test(password);

    return res.strong ? res.strong : res.errors;
  }

  public checkPassword(password: string): void {
    if (password) {
      const isSecurePassword = this.isSecure(password);

      if (Array.isArray(isSecurePassword)) {
        throw new BadRequest(JSON.stringify({
          isSecurePassword,
          message: `Password does not meet security requirements`,
        }));
      }
    }
  }
}
