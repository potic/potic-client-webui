'use strict';

import baseConfig from './base';

let config = {
  appEnv: 'dev',
  auth0CallbackUrl: 'http://localhost:8000/callback'
};

export default Object.freeze(Object.assign({}, baseConfig, config));
