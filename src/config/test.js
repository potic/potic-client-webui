'use strict';

import baseConfig from './base';

let config = {

  appEnv: 'test',

  title: 'potic.x',

  auth0_callbackUrl: 'http://185.14.185.186/callback'
};

export default Object.freeze(Object.assign(baseConfig, config));
