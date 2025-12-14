import { Container } from 'inversify';
import { EventEmitter, systemEventEmitter } from '../../infra/events';
import { MailService } from '../../infra/MailService';

export const container = new Container();

container.bind(EventEmitter).toConstantValue(systemEventEmitter);
container.bind(MailService).toSelf().inSingletonScope();

import '../../modules/organization/container';
import '../../modules/people/container';
import '../../modules/reference/container';
import '../../modules/services/container';
import '../../modules/user/container';
