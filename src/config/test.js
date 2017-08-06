'use strict';

import baseConfig from './base';

let config = {
  appEnv: 'test',

  auth0_callbackUrl: 'http://185.14.185.186/callback'
};

export default Object.freeze(Object.assign(baseConfig, config));
