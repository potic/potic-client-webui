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
      markedAsReadCards: []
    };

    this.fetchCards = this.fetchCards.bind(this);
    this.markCardAsRead = this.markCardAsRead.bind(this);
  }

  componentDidMount() {
    this.fetchSections();
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  render() {
    return (
      <div>
        <AlertContainer ref={(msg) => global.message = msg} {...this.alertOptions} />

        {Array(this.state.sections.length).fill().map((_, sectionIndex) => (
          <PoticSection
            fetchCards={(count, shouldFocus) => this.fetchCards(sectionIndex, count, shouldFocus) }
            markCardAsRead={(cardId) => this.markCardAsRead(cardId, sectionIndex) }
            section={this.state.sections[sectionIndex]}
            markedAsReadCards={this.state.markedAsReadCards}
            focusCardId={ sectionIndex === this.state.focusSectionIndex ? this.state.focusCardId : ""} />
         ))}
      </div>
    );
  }

  fetchSections() {
    this.props.log.send('INFO', 'potic.web.PoticGrid', 'fetching sections...');

    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}

    axios.get(`${config.services_sections}/section`, { headers })
      .then(res => {
        const sections = res.data;
        this.props.log.send('DEBUG', 'potic.web.PoticGrid', `fetched sections ${JSON.stringify(sections)}`);

        sections.forEach(section => { section['cards'] = []; });

        this.setState({
          focusCardId: "",
          focusSectionIndex: "",
          sections: sections,
          markedAsReadCards: this.state.markedAsReadCards
        });

        Array(this.state.sections.length).fill().map((_, sectionIndex) => {
            this.props.log.send('DEBUG', 'potic.web.PoticGrid', `fetching head of section ${this.state.sections[sectionIndex].id}`);
            this.fetchCards(sectionIndex, 5, false);
        });
      })
      .catch(function (error) {
        this.props.log.send('ERROR', 'potic.web.PoticGrid', `fetching sections failed: ${error}`);
        message.error(`Can't get sections: ${error}`)
      });
  }

  fetchCards(sectionIndex, count, shouldFocus) {
    this.props.log.send('INFO', 'potic.web.PoticGrid', `fetching ${count} cards for section ${this.state.sections[sectionIndex].id}, should_focus=${shouldFocus}...`);

    const { getAccessToken } = this.props.auth;

    axios({
        method: 'post',
        url: `${config.services_sections}/section/${this.state.sections[sectionIndex]['id']}`,
        headers: { 'Authorization': `Bearer ${getAccessToken()}`},
        data: { count: count, skipIds: this.state.sections[sectionIndex]['cards'].map(card => card.id) }
    }).then(res => {
        const cards = res.data;
        this.props.log.send('DEBUG', 'potic.web.PoticGrid', `fetched cards ${JSON.stringify(cards)} for section ${this.state.sections[sectionIndex].id}`);

        this.state.sections[sectionIndex]['cards'].push.apply(this.state.sections[sectionIndex]['cards'], cards);

        this.setState({
          focusCardId: shouldFocus ? cards[cards.length - 1]['id'] : "",
          focusSectionIndex: sectionIndex,
          sections: this.state.sections,
          markedAsReadCards: this.state.markedAsReadCards
        });
      })
      .catch(function (error) {
        this.props.log.send('ERROR', 'potic.web.PoticGrid', `fetching cards for section ${this.state.sections[sectionIndex].id} failed: ${error}`);
        message.error(`Can't get cards for section: ${error}`)
      });
  }

  markCardAsRead(id, sectionIndex) {
    this.props.log.send('INFO', 'potic.web.PoticGrid', `marking cards #${id} from section ${this.state.sections[sectionIndex].id} as read...`);

    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}

    axios.post(`${config.services_articles}/user/me/article/${id}/markAsRead`, {}, { headers })
      .then(res => {
        this.setState({
          focusCardId: "",
          focusSectionIndex: "",
          sections: this.state.sections,
          markedAsReadCards: this.state.markedAsReadCards.concat([id])});
        this.fetchCards(sectionIndex, 1, false);
      })
      .catch(function (error) {
        this.props.log.send('ERROR', 'potic.web.PoticGrid', `marking cards #${id} from section ${this.state.sections[sectionIndex].id} as read failed: ${error}`);
        message.error(`Can't mark card as read: ${error}`)
      });
  }
}

export default PoticGrid;
