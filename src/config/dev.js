'use strict';

import baseConfig from './base';

let config = {

  appEnv: 'dev',

  title: 'potic.dev',

  services_aggregator: 'http://localhost:40401',
  services_articles: 'http://localhost:40402'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
