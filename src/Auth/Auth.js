import history from '../history';
import auth0 from 'auth0-js';
import config from 'config';

export default class Auth {

  userProfile;

  tokenRenewalTimeout;

  log;

  constructor(log) {
    this.auth0 = new auth0.WebAuth({
      domain: config.auth0_domain,
      clientID: config.auth0_clientId,
      redirectUri: config.auth0_callbackUrl,
      audience: config.auth0_audience,
      responseType: config.auth0_response,
      scope: config.auth0_scope
    });

    this.log = log;

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getProfile = this.getProfile.bind(this);

    this.scheduleRenewal();
  }

  login() {
    this.log.send('INFO', 'me.potic.web.Auth', `logging in...`);
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        history.replace('/');
      } else if (err) {
        this.log.send('ERROR', 'me.potic.web.Auth', `authentication failed: ${err.error}`);
        history.replace('/');
      }
    });
  }

  setSession(authResult) {
    this.log.send('DEBUG', 'me.potic.web.Auth', `saving session into local storage...`);

    // set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    // schedule a token renewal
    this.scheduleRenewal();
  }

  logout() {
    this.log.send('INFO', 'me.potic.web.Auth', `logging out...`);

    // clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    // cancel a token renewal
    clearTimeout(this.tokenRenewalTimeout);

    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  }

  getProfile(cb) {
    this.log.send('INFO', 'me.potic.web.Auth', `getting user profile...`);

    let accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  renewToken() {
    this.log.send('INFO', 'me.potic.web.Auth', `renewing token...`);

    this.auth0.renewAuth(
      {
        audience: config.auth0_audience,
        redirectUri: config.auth0_tokenRenewerUrl,
        usePostMessage: true,
        postMessageOrigin: config.auth0_tokenRenewerUrl
      },
      (err, result) => {
        if (err) {
          this.log.send('ERROR', 'me.potic.web.Auth', `Could not get a new token using silent authentication: ${err.error}`);
          this.login();
        } else {
          this.setSession(result);
        }
      }
    );
  }

  scheduleRenewal() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    const tokenLifetime = expiresAt - Date.now();
    this.log.send('DEBUG', 'me.potic.web.Auth', `Token will expire in ${tokenLifetime}ms`);

    if (tokenLifetime > 0) {
      const delay = tokenLifetime / 10;
      this.log.send('INFO', 'me.potic.web.Auth', `Scheduled token renewal in ${delay}ms`);
      this.tokenRenewalTimeout = setTimeout(() => { this.renewToken(); }, delay);
    } else {
      this.login();
    }
  }
}
