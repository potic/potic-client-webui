'use strict';

import baseConfig from './base';

let config = {
  appEnv: 'dev',

  auth0_callbackUrl: 'http://localhost:8000/callback'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
