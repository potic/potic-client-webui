'use strict';

import baseConfig from './base';

let config = {
  appEnv: 'dist',

  auth0_callbackUrl: 'http://46.101.62.243/callback',

  services_aggregator: 'http://potic-aggregator:8080'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
