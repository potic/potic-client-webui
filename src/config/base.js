'use strict';

export default {

  title: 'potic',

  auth0_domain: 'potic.auth0.com',
  auth0_clientId: 'NtKWNf6V7S_gmV50Cz4zKJVAaAeNPxwe',
  auth0_audience: 'potic-api',
  auth0_response: 'token id_token',
  auth0_scope: 'openid profile get:articles update:articles',

  services_aggregator: 'http://185.14.185.186:40401',
  services_articles: 'http://185.14.185.186:40402'

}
