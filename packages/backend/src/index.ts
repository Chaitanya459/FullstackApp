import config from 'config';
import apm from 'elastic-apm-node';
apm.start({
  active: config.get(`logging.apm.enabled`),
  captureBody: `off`,
  secretToken: config.get(`logging.apm.secretToken`),
  serverUrl: config.get(`logging.apm.url`),
});

import './infra/http/app';
import './infra/database/sequelize';
import './infra/events/subscriptions';
