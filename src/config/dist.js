'use strict';

import baseConfig from './base';

let config = {

  appEnv: 'dist',
  env: 'prod',

  services_sections: 'http://46.101.62.243:40401',
  services_articles: 'http://46.101.62.243:40402',
  services_logger: 'http://46.101.62.243:40410',

  auth0_callbackUrl: 'http://46.101.62.243/callback',
  auth0_tokenRenewerUrl: 'http://46.101.62.243:40407'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
