import config from 'config';
import axios from 'axios';

export default class Log {

  send(loglevel, logger, message) {
    axios({
        method: 'post',
        url: config.services_logger,
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}`},
        data: { service: config.services_self, env: config.env, logger: logger, loglevel: loglevel, message: message }
    }).then(res => {
        if (config.env != 'prod') {
          console.log(`${loglevel} ${logger} - ${message}`);
        }
      })
      .catch(function (error) {
        console.log(`WARN - failed to deliver log message: ${error}`);
        console.log(`${loglevel} ${logger} - ${message}`);
      });
  }
}
