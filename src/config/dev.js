'use strict';

import baseConfig from './base';

let config = {

  appEnv: 'dev',

  title: 'potic.dev',

  services_aggregator: 'http://localhost:40401',
  services_articles: 'http://localhost:40402',

  auth0_callbackUrl: 'http://localhost:8000/callback',
  auth0_tokenRenewerUrl: 'http://localhost:40407'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
