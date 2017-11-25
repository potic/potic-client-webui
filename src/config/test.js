'use strict';

import baseConfig from './base';

let config = {

  appEnv: 'test',

  title: 'potic.x',

  services_aggregator: 'http://185.14.185.186:40401',
  services_articles: 'http://185.14.185.186:40402',

  auth0_callbackUrl: 'http://185.14.185.186/callback',
  auth0_tokenRenewerUrl: 'http://185.14.185.186:40407'
};

export default Object.freeze(Object.assign(baseConfig, config));
