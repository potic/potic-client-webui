import React from 'react';
import AlertContainer from 'react-alert';
import PoticSection from '../PoticSection/PoticSection';
import axios from 'axios';
import config from 'config';
import {Tabs, Tab} from 'material-ui/Tabs';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
    color: "black"

  },
  tab: {
    backgroundColor: "white",
  },
  tabElement: {
    color: "black"
  }
};

class PoticGrid extends React.Component {

  alertOptions = {
    offset: 14,
    position: 'top left',
    theme: 'light',
    time: 5000,
    transition: 'scale'
  };

  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      sections: [],
      hiddenCards: []
    };

    this.fetchCards = this.fetchCards.bind(this);
    this.markCardLiked = this.markCardLiked.bind(this);
    this.markCardDisliked = this.markCardDisliked.bind(this);
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  componentDidMount() {
    this.fetchSections();
  }

  render() {
    return (
      <div>
        <AlertContainer ref={(msg) => global.message = msg} {...this.alertOptions} />
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          tabItemContainerStyle={styles.tab} >

        {Array(this.state.sections.length).fill().map((_, sectionIndex) => (
          <Tab
            style={styles.tabElement}
            label={this.state.sections[sectionIndex]['title']}
            value={sectionIndex} >
          <PoticSection
            fetchCards={(count, shouldFocus) => this.fetchCards(sectionIndex, count, shouldFocus) }
            markCardLiked={(cardId) => this.markCardLiked(cardId, sectionIndex) }
            markCardDisliked={(cardId) => this.markCardDisliked(cardId, sectionIndex) }
            section={this.state.sections[sectionIndex]}
            hiddenCards={this.state.hiddenCards}
            focusCardId={ sectionIndex === this.state.focusSectionIndex ? this.state.focusCardId : ''} />
          </Tab>
         ))}
       </Tabs>
      </div>
    );
  }

  fetchSections() {
    this.props.log.send('INFO', 'me.potic.web.PoticGrid', 'fetching sections...');

    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}

    axios.get(`${config.services_sections}/section`, { headers })
      .then(res => {
        const sections = res.data;
        this.props.log.send('DEBUG', 'me.potic.web.PoticGrid', `fetched sections ${JSON.stringify(sections)}`);

        sections.forEach(section => { section['cards'] = []; });

        this.setState({
          focusCardId: '',
          focusSectionIndex: '',
          sections: sections,
          hiddenCards: this.state.hiddenCards
        });

        Array(this.state.sections.length).fill().map((_, sectionIndex) => {
            this.props.log.send('DEBUG', 'me.potic.web.PoticGrid', `fetching head of section ${this.state.sections[sectionIndex].id}`);
            this.fetchCards(sectionIndex, 20, false);
        });
      })
      .catch(function (error) {
        this.props.log.send('ERROR', 'me.potic.web.PoticGrid', `fetching sections failed: ${error}`);
        message.error(`Can't get sections: ${error}`)
      });
  }

  fetchCards(sectionIndex, count, shouldFocus) {
    this.props.log.send('INFO', 'me.potic.web.PoticGrid', `fetching ${count} cards for section ${this.state.sections[sectionIndex].id}, should_focus=${shouldFocus}...`);

    const { getAccessToken } = this.props.auth;

    axios({
        method: 'post',
        url: `${config.services_sections}/section/${this.state.sections[sectionIndex]['id']}`,
        headers: { 'Authorization': `Bearer ${getAccessToken()}`},
        data: { count: count, skipIds: this.state.sections[sectionIndex]['cards'].map(card => card.id) }
    }).then(res => {
        const cards = res.data;
        this.props.log.send('DEBUG', 'me.potic.web.PoticGrid', `fetched cards ${JSON.stringify(cards)} for section ${this.state.sections[sectionIndex].id}`);

        this.state.sections[sectionIndex]['cards'].push.apply(this.state.sections[sectionIndex]['cards'], cards);

        this.setState({
          focusCardId: shouldFocus ? cards[cards.length - 1]['id'] : '',
          focusSectionIndex: sectionIndex,
          sections: this.state.sections,
          hiddenCards: this.state.hiddenCards
        });
      })
      .catch(function (error) {
        this.props.log.send('ERROR', 'me.potic.web.PoticGrid', `fetching cards for section ${this.state.sections[sectionIndex].id} failed: ${error}`);
        message.error(`Can't get cards for section: ${error}`)
      });
  }

  markCardLiked(id, sectionIndex) {
    this.props.log.send('INFO', 'me.potic.web.PoticGrid', `marking cards #${id} from section ${this.state.sections[sectionIndex].id} as liked...`);

    const { getAccessToken } = this.props.auth;

    axios({
        method: 'post',
        url: `${config.services_articles}/user/me/article/${id}/like`,
        headers: { 'Authorization': `Bearer ${getAccessToken()}`},
        data: { skipIds: this.state.sections[sectionIndex]['cards'].map(card => card.id) }
    }).then(_ => {
        this.setState({
          focusCardId: '',
          focusSectionIndex: '',
          sections: this.state.sections,
          hiddenCards: this.state.hiddenCards.concat([id])});
        this.fetchCards(sectionIndex, 1, false);
      })
      .catch(function (error) {
        this.props.log.send('ERROR', 'me.potic.web.PoticGrid', `marking cards #${id} from section ${this.state.sections[sectionIndex].id} as liked failed: ${error}`);
        message.error(`Can't mark card as liked: ${error}`)
      });
  }

  markCardDisliked(id, sectionIndex) {
    this.props.log.send('INFO', 'me.potic.web.PoticGrid', `marking cards #${id} from section ${this.state.sections[sectionIndex].id} as disliked...`);

    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}

    axios.post(`${config.services_articles}/user/me/article/${id}/dislike`, {}, { headers })
      .then(_ => {
        this.setState({
          focusCardId: '',
          focusSectionIndex: '',
          sections: this.state.sections,
          hiddenCards: this.state.hiddenCards.concat([id])});
        this.fetchCards(sectionIndex, 1, false);
      })
      .catch(function (error) {
        this.props.log.send('ERROR', 'me.potic.web.PoticGrid', `marking cards #${id} from section ${this.state.sections[sectionIndex].id} as disliked failed: ${error}`);
        message.error(`Can't mark card as disliked: ${error}`)
      });
  }
}

export default PoticGrid;
