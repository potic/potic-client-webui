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

        {Array(this.state.sections.length).fill().map((_, i) => (
          <PoticSection
            fetchCards={(s, b) => this.fetchCards(i, s, b) }
            markCardAsRead={(id) => this.markCardAsRead(id, i) }
            section={this.state.sections[i]}
            blacklistedCards={this.state.blacklistedCards}
            focusCardId={ i === this.state.sectionInd ? this.state.focusCardId : ""} />
         ))}
      </div>
    );
  }

  fetchSections() {
    console.log('fetching sections...');

    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}

    axios.get(`${config.services_sections}/section`, { headers })
      .then(res => {
        const sections = res.data;
        console.log(`fetched sections ${JSON.stringify(sections)}`);

        sections.forEach(section => {
            section['cards'] = [];
        });

        this.setState({
          focusCardId: "",
          sectionInd: "",
          sections: sections,
          size: this.state.size,
          nextPage: 1,
          blacklistedCards: this.state.blacklistedCards
        });

        Array(this.state.sections.length).fill().map((_, sectionIndex) => {
            console.log(`fetching head of section ${JSON.stringify(this.state.sections[sectionIndex])}`);
            this.fetchCards(sectionIndex, 5, false);
        });
      })
      .catch(function (error) {
        console.log(`fetching sections failed: ${error}`);
        message.error(`Can't get sections: ${error}`)
      });
  }

  fetchCards(sectionIndex, count, shouldFocus) {
    console.log(`fetching ${count} cards for section ${JSON.stringify(this.state.sections[sectionIndex])}, should_focus=${shouldFocus}...`);

    const { getAccessToken } = this.props.auth;

    axios({
        method: 'post',
        url: `${config.services_sections}/section/${this.state.sections[sectionIndex]['id']}`,
        headers: { 'Authorization': `Bearer ${getAccessToken()}`},
        data: { count: count, skipIds: this.state.sections[sectionIndex]['cards'].map(card => card.id) }
    }).then(res => {
        const cards = res.data;
        console.log(`fetched cards ${JSON.stringify(cards)} for section ${JSON.stringify(this.state.sections[sectionIndex])}`);

        this.state.sections[sectionIndex]['cards'].push.apply(this.state.sections[sectionIndex]['cards'], cards);

        this.setState({
          focusCardId: shouldFocus ? cards[cards.length - 1]['id'] : "",
          sectionInd: sectionIndex,
          sections: this.state.sections,
          size: this.state.size,
          nextPage: this.state.nextPage,
          blacklistedCards: this.state.blacklistedCards
        });
      })
      .catch(function (error) {
        console.log(`fetching cards for section ${JSON.stringify(this.state.sections[sectionIndex])} failed: ${error}`);
        message.error(`Can't get cards for section: ${error}`)
      });
  }

  markCardAsRead(id, section_ind) {
    console.log(`marking cards #${id} from section ${JSON.stringify(this.state.sections[section_ind])} as read...`);

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
        this.fetchCards(section_ind, 1, false);
      })
      .catch(function (error) {
        console.log(`marking cards #${id} from section ${JSON.stringify(this.state.sections[section_ind])} as read failed: ${error}`);
        message.error(`Can't mark card as read: ${error}`)
      });
  }
}

export default PoticGrid;
