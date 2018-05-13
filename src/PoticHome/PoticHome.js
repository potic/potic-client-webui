import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import PoticBar from '../PoticBar/PoticBar';
import PoticGrid from '../PoticGrid/PoticGrid';

class PoticHome extends Component {

  login() {
    this.props.auth.login();
  }

  logout() {
    this.props.auth.logout();
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <div className="container-fluid">
        <MuiThemeProvider>
          <PoticBar
            isAuthenticated={() => this.props.auth.isAuthenticated()}
            login={() => this.props.auth.login()}
            logout={() => this.props.auth.logout()}
            userProfile={this.props.auth}
            getProfile={(cb) => this.props.auth.getProfile(cb)} />
        </MuiThemeProvider>

        {
          isAuthenticated() && (
            <MuiThemeProvider>
              <PoticGrid {...this.props} />
            </MuiThemeProvider>
          )
        }
      </div>
    );
  }
}

export default PoticHome;
