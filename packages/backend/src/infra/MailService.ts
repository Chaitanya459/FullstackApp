import config from 'config';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { injectable } from 'inversify';
import { logger } from '../utils';

export interface ISendEmail extends Pick<SendMailOptions, `attachments` | `subject` | `cc` | `to`> {
  body: string;
}

@injectable()
export class MailService {
  private transporter: Transporter;

  public constructor() {
    this.transporter = createTransport({
      host: config.get(`mailer.host`),
      port: config.get(`mailer.port`),
      tls: config.get(`mailer.tls`),
    });

    this.transporter.verify((error) => {
      if (error) {
        logger.error(``, error);
      } else {
        logger.info(`Successfully connected to mail server`);
      }
    });
  }

  public send({ attachments, body, cc = [], subject, to }: ISendEmail) {
    /* eslint-disable sort-keys-custom-order/object-keys */
    return this.transporter.sendMail({
      attachments,
      from: `"${config.get<string>(`mailer.name`)}" <${config.get<string>(`mailer.sender`)}>`,
      to,
      cc,
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Importance': `High`,
        'X-MSMail-Priority': `High`,
        'X-Priority': `1 (Highest)`,
      },
      subject,
      html: body,
    });
    /* eslint-enable sort-keys-custom-order/object-keys */
  }
}
