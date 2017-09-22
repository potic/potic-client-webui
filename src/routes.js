import React from 'react';
import { Redirect, Route, BrowserRouter } from 'react-router-dom';
import PoticHome from './PoticHome/PoticHome';
import Callback from './Callback/Callback';
import Auth from './Auth/Auth';
import history from './history';

const auth = new Auth();

const handleAuthentication = (nextState, replace) => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
}

export const makeMainRoutes = () => {
  return (
      <BrowserRouter history={history} component={PoticHome}>
        <div>
          <Route path="/" render={(props) => <PoticHome auth={auth} {...props} />} />
          <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} />
          }} />
          <Route path="/renew" render={(props) => {
            <Redirect to="/renew.html"/>
          }} />
        </div>
      </BrowserRouter>
  );
}
