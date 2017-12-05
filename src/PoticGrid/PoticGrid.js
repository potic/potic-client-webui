import React, { Component } from 'react';
import AlertContainer from 'react-alert';
import PoticSection from '../PoticSection/PoticSection';
import axios from 'axios';
import config from 'config';

class PoticGrid extends React.Component {

  alertOptions = {
    offset: 14,
    position: 'top left',
    theme: 'light',
    time: 5000,
    transition: 'scale'
  }

  constructor(props) {
    super(props);

    this.state = {
      sections: [],
      blacklistedCards: [],
      nextPage: 0,
      size: 12,
    };

    this.fetchCardData = this.fetchCardData.bind(this);
    this.markCardAsRead = this.markCardAsRead.bind(this);
  }

  markCardAsRead(id, section_ind) {
    console.log('MARK CARD AS READ');

    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}

    axios.post(`${config.services_articles}/user/me/article/${id}/markAsRead`, {}, { headers })
      .then(res => {
        this.setState({
          focusCardId: "",
          sectionInd: "",
          sections: this.state.sections,
          size: this.state.size,
          nextPage: this.state.nextPage,
          blacklistedCards: this.state.blacklistedCards.concat([id])});
        this.fetchCardData(section_ind, 1, false);
      })
      .catch(function (error) {
        console.log(error);
        message.error('Can\'t mark card as read: ' + error)
      });
  }

  fetchData() {
    console.log('START FETCH FOR PAGE '+ this.state.nextPage);

    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}

    axios.get(`${config.services_sections}/user/me/section`, { headers })
      .then(res => {
        const sections = res.data;
        console.log(res);
        if (this.state.nextPage == 0) {
          this.setState({
            focusCardId: "",
            sectionInd: "",
            sections: sections,
            size: this.state.size,
            nextPage: 1,
            blacklistedCards: this.state.blacklistedCards });
        } else {
          this.setState({
            focusCardId: "",
            sectionInd: "",
            sections: this.state.sections.concat(sections),
            size: this.state.size,
            nextPage: this.state.nextPage + 1,
            blacklistedCards: this.state.blacklistedCards });
        }
      })
      .catch(function (error) {
        console.log(error);
        message.error('Can\'t get cards: ' + error)
      });
  }

  fetchCardData(ind, count, shouldFocus) {
    console.log('fetch card data');
    console.log(ind);

    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}

    axios.get(`${config.services_sections}/user/me/section/${this.state.sections[ind]['id']}?cursorId=${this.state.sections[ind]['firstChunk']['nextCursorId']}&count=${count}`, { headers })
      .then(res => {
        const sections = res.data;
        console.log(res);

        this.state.sections[ind]['firstChunk']['cards'].push.apply(this.state.sections[ind]['firstChunk']['cards'], sections['cards']);
        this.state.sections[ind]['firstChunk']['nextCursorId'] = sections['nextCursorId'];

        this.setState({
          focusCardId: shouldFocus ? sections['cards'][sections['cards'].length - 1]['id'] : "",
          sectionInd: ind,
          sections: this.state.sections,
          size: this.state.size,
          nextPage: this.state.nextPage,
          blacklistedCards: this.state.blacklistedCards});
      })
      .catch(function (error) {
        console.log(error);
        message.error('Can\'t get cards: ' + error)
      });
  }

  componentDidMount() {
    this.fetchData();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    return (
      <div>
        <AlertContainer ref={(msg) => global.message = msg} {...this.alertOptions} />

        {Array(this.state.sections.length).fill().map((_, i) => (
          <PoticSection
            fetchCardData={(s, b) => this.fetchCardData(i, s, b) }
            markCardAsRead={(id) => this.markCardAsRead(id, i) }
            section={this.state.sections[i]}
            blacklistedCards={this.state.blacklistedCards}
            focusCardId={ i === this.state.sectionInd ? this.state.focusCardId : ""} />
         ))}
      </div>
    );
  }
}

export default PoticGrid;
