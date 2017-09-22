import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import config from 'config';

class PoticBar extends Component {

  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile } = this.props.userProfile;
    const { getProfile } = this.props;
    const { isAuthenticated } = this.props;
    if (!userProfile) {
      if (isAuthenticated()) {
        getProfile((err, profile) => {
          this.setState({ profile });
        });
      }
    } else {
      this.setState({ profile: userProfile });
    }
  }

  render() {
    const { profile } = this.state;
    const { isAuthenticated } = this.props;

    const title = `${config.title}${isAuthenticated() ? ' for ' + profile.name : ''}`

    return (
      <AppBar
        title={title}
        iconElementLeft={isAuthenticated() ? <Avatar src={profile.picture} /> : <FontIcon />}
        iconElementRight={isAuthenticated() ? <FlatButton label="Log Out" onClick={this.props.logout.bind(this)} /> : <FlatButton label="Log In" onClick={this.props.login.bind(this)} />} >
      </AppBar>
    );
  }
}

export default PoticBar;
