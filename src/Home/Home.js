import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col, Button, PageHeader } from 'react-bootstrap';
import AlertContainer from 'react-alert'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import Profile from '../Profile/Profile';
import config from 'config';
import axios from 'axios';
import './Home.css';

class Home extends Component {

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
        <PageHeader>
          <Grid>
            <Row className="show-grid">
              <Col md={7}>potic</Col>
              <Col md={3}>
                {
                  isAuthenticated() && (
                    <small><Profile {...this.props} /></small>
                  )
                }
              </Col>
              <Col md={2}>
                {
                  isAuthenticated() && (
                    <Button bsStyle="primary" className="btn-margin" onClick={this.logout.bind(this)}>
                      Log Out
                    </Button>
                  )
                }
                {
                  !isAuthenticated() && (
                    <Button bsStyle="primary" className="btn-margin" onClick={this.login.bind(this)}>
                      Log In
                    </Button>
                  )
                }
              </Col>
            </Row>
          </Grid>
        </PageHeader>

        {
          isAuthenticated() && (
            <MuiThemeProvider>
              <PocketSquareGrid {...this.props} />
            </MuiThemeProvider>
          )
        }
      </div>
    );
  }
}

const styles = {
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  },
  card: {
    margin: 5,
    width: 300,
    minWidth: 300,
  },
  cardInner: {
    display: 'flex',
    flexDirection: 'column',
    height: 480,
    justifyContent: 'flex-end',
    overflowY: 'hidden',
  },
  media: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    overflowY: 'hidden',
  },
  title: {
    lineHeight: 1,
  },
  link: {
    textDecoration:'none',
  },
  subheader: {
    fontSize: '45px',
  },
  subheaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  scrollLeft: {
    fontSize: '45px',
  },
  scrollRight: {
    fontSize: '45px',
  }
};

class PocketSquareGrid extends React.Component {

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

    axios.get(`${config.services_aggregator}/user/me/section`, { headers })
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

    axios.get(`${config.services_aggregator}/user/me/section/${this.state.sections[ind]['id']}?cursorId=${this.state.sections[ind]['firstChunk']['nextCursorId']}&count=${count}`, { headers })
      .then(res => {
        const sections = res.data;
        console.log(res);

        this.state.sections[ind]['firstChunk']['articles'].push.apply(this.state.sections[ind]['firstChunk']['articles'], sections['articles']);
        this.state.sections[ind]['firstChunk']['nextCursorId'] = sections['nextCursorId'];

        this.setState({
          focusCardId: shouldFocus ? sections['articles'][sections['articles'].length - 1]['id'] : "",
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
          <PocketSquareSection
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

class PocketSquareSection extends React.Component {
  constructor(props) {
      super(props);
  }

  componentDidUpdate() {
    if (this.cardNode && this.props.focusCardId !== "") {
      var containerDOM = ReactDOM.findDOMNode(this.cardContainer);
      containerDOM.scrollLeft = 0;
      var rect = ReactDOM.findDOMNode(this.cardNode).getBoundingClientRect();
      containerDOM.scrollLeft = rect.right;
    }
  }

  render() {
    return (
      <div>
         <div style={styles.subheaderContainer}>
           <Subheader style={styles.subheader}>{this.props.section['title']}</Subheader>
           <div style={styles.scrollContainer}>
             <FlatButton label="<" style={styles.scrollLeft} onClick={() => {}}/>
             <FlatButton label=">" style={styles.scrollRight} onClick={() => {this.props.fetchCardData(5, true)}}/>
           </div>
         </div>
         <div style={styles.gridList} ref={(node) => {this.cardContainer = node;}}>
           {this.props.section['firstChunk']['articles']
             .filter((post) => {return this.props.blacklistedCards.indexOf(post.id) < 0;})
             .map((post) => (<PocketSquareCard
               post={post}
               key={post.id}
               ref={(node) => {
                 if (this.props.focusCardId === post.id) {
                   this.cardNode = node;
                 }
               }}
               onMarkAsRead={this.props.markCardAsRead}/>))}
         </div>
       </div>
    );
  }
};

class PocketSquareCard extends React.Component {
  constructor(props) {
      super(props);
  }

  render() {
    return (
      <Card style={styles.card} >
        <div style={styles.cardInner}>
          <CardMedia style={styles.media}>
            <img src={this.props.post.mainImage ? this.props.post.mainImage.src  : null} />
          </CardMedia>
          <a href={this.props.post.resolvedUrl} style={styles.link} target="_blank">
            <CardTitle title={this.props.post.title} subtitle={this.props.post.source} titleStyle={styles.title} />
          </a>
          <CardText>
            {this.props.post.excerpt}
          </CardText>
          <CardActions>
            <FlatButton label="@pocket"  />
            <FlatButton label="mark as read" onClick={() => this.props.onMarkAsRead(this.props.post.id)} />
          </CardActions>
        </div>
      </Card>
    );
  }
};

export default Home;
