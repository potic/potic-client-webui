'use strict';

import baseConfig from './base';

let config = {
  appEnv: 'dist',

  services_sections: 'http://46.101.62.243:40401',
  services_articles: 'http://46.101.62.243:40402',

  auth0_callbackUrl: 'http://46.101.62.243/callback',
  auth0_tokenRenewerUrl: 'http://46.101.62.243:40407'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
