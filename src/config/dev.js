'use strict';

import baseConfig from './base';

let config = {
  appEnv: 'dev',

  auth0_callbackUrl: 'http://localhost:8000/callback',

  services_aggregator: 'http://185.14.185.186:40401'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
