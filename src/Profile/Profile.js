import React, { Component } from 'react';
import { Image } from 'react-bootstrap';

class Profile extends Component {

  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }

  render() {
    const { profile } = this.state;
    return (
      <div>
        <Image width={32} height={32} src={profile.picture} circle />
        <span>   </span>
        <span>{profile.name}</span>
      </div>
    );
  }
}

export default Profile;
