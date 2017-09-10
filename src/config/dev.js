'use strict';

import baseConfig from './base';

let config = {
  appEnv: 'dev',

  auth0_callbackUrl: 'http://localhost:8000/callback',

  // services_aggregator: 'http://localhost:40401',
  // services_articles: 'http://localhost:40402'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
