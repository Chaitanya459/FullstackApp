import path from 'node:path';
import appRoot from 'app-root-path';
import { inject, injectable } from 'inversify';
import { ITokenService } from '../../services/TokenService';
import { IUserRepo } from '../repos';
import { IUseCase } from '../../../../types';
import { renderEmailTemplate } from '../../../../utils';
import { MailService } from '../../../../infra/MailService';

export interface IRequestPasswordResetInput {
  email: string;
  type?: `reset` | `newAccount`;
}

@injectable()
export class RequestPasswordResetUseCase implements IUseCase<IRequestPasswordResetInput, void> {
  public constructor(
    @inject(IUserRepo) private userRepo: IUserRepo,
    @inject(ITokenService) private tokenService: ITokenService,
    @inject(MailService) private mailService: MailService,
  ) { }

  public async execute({ email, type = `reset` }: IRequestPasswordResetInput): Promise<void> {
    const user = await this.userRepo.getByEmail(email.trim().toLowerCase());

    if (user) {
      const token = this.tokenService.generatePasswordResetToken(
        user,
        type === `reset` ? undefined : `1w`,
      );

      const templateType = type === `reset` ? `requestPasswordReset` : `newAccountPasswordReset`;

      const html = await renderEmailTemplate(templateType, {
        email: user.email,
        environmentMessage: this.getEnvironmentSpecificMessage(),
        resetUrl: `/login?prt=${token}`,
      });

      await this.mailService.send({
        attachments: [{
          cid: `logo`,
          filename: `email-heading-logo.png`,
          path: `${path.resolve(appRoot.path, `packages`, `backend`, `emailTemplates`, `images`, `logo.png`)}`,
        }],
        body: html,
        subject: type === `reset` ?
          `Ohio SPDG Evaluation Platform Password Reset` :
          `Welcome to Ohio SPDG Evaluation Platform`,
        to: user.email,
      });
    }
  }

  private getEnvironmentSpecificMessage() {
    if (process.env.NODE_ENV && [ `dev`, `staging` ].includes(process?.env?.NODE_ENV)) {
      return `the ${process.env.NODE_ENV} environment of`;
    }
  }
}
