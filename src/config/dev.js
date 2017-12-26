'use strict';

import baseConfig from './base';

let config = {

  appEnv: 'dev',
  env: 'dev',

  title: 'potic.dev',

  //services_sections: 'http://localhost:40401',
  services_sections: 'http://185.14.185.186:40401',
  //services_articles: 'http://localhost:40402',
  services_articles: 'http://185.14.185.186:40402',
  //services_logger: 'http://localhost:40410',
  services_logger: 'http://185.14.185.186:40410',

  auth0_callbackUrl: 'http://localhost:8000/callback',
  auth0_tokenRenewerUrl: 'http://localhost:40407'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
