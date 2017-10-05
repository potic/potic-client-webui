'use strict';

import baseConfig from './base';

let config = {
  appEnv: 'dist',

  services_aggregator: 'http://46.101.62.243:40401',
  services_articles: 'http://46.101.62.243:40402',

  auth0_callbackUrl: 'http://46.101.62.243/callback'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
