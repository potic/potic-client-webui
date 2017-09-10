import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Navbar, Button } from 'react-bootstrap';
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
      <div className="container">
        {
          isAuthenticated() && (
            <div>
              <Navbar fluid>
                <Navbar.Header>
                  <Profile {...this.props} />
                  <Button bsStyle="primary" className="btn-margin" onClick={this.logout.bind(this)}>
                    Log Out
                  </Button>
                </Navbar.Header>
              </Navbar>

              <MuiThemeProvider>
                <PocketSquareGrid {...this.props} />
              </MuiThemeProvider>
            </div>
          )
        }
        {
          !isAuthenticated() && (
              <h4>
                You are not logged in! Press{' '}
                <a
                  style={{ cursor: 'pointer' }}
                  onClick={this.login.bind(this)}
                >
                  Log In
                </a>
                {' '}to continue.
              </h4>
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
};

class PocketSquareGrid extends React.Component {
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
          sections: this.state.sections,
          size: this.state.size,
          nextPage: this.state.nextPage,
          blacklistedCards: this.state.blacklistedCards.concat([id])});
        this.fetchCardData(section_ind, 1, false);
        this.postMarkCardAsRead(id);
      })
      .catch(function (error) {
        console.log(error);
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
            sections: sections,
            size: this.state.size,
            nextPage: 1,
            blacklistedCards: this.state.blacklistedCards });
        } else {
          this.setState({
            focusCardId: "",
            sections: this.state.sections.concat(sections),
            size: this.state.size,
            nextPage: this.state.nextPage + 1,
            blacklistedCards: this.state.blacklistedCards });
        }
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
          sections: this.state.sections,
          size: this.state.size,
          nextPage: this.state.nextPage,
          blacklistedCards: this.state.blacklistedCards});
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
        {Array(this.state.sections.length).fill().map((_, i) => (
         <div>
            <Subheader style={styles.subheader}>{this.state.sections[i]['title']}</Subheader>
            <div style={styles.gridList} >
              {this.state.sections[i]['firstChunk']['articles']
                .filter((post) => {return this.state.blacklistedCards.indexOf(post.id) < 0;})
                .map((post) => (<PocketSquareCard post={post} shouldFocus={this.state.focusCardId === post.id} key={post.id} onMarkAsRead={(id) => this.markCardAsRead(id, i)}/>))}
            </div>
            <FlatButton label="Expand" fullWidth={true} onClick={() => {this.fetchCardData(i, 5, true)}}/>
          </div>
         ))}
      </div>
    );
  }
}

class PocketSquareCard extends React.Component {
  constructor(props) {
      super(props);
  }

  componentDidMount() {
    if (this.props.shouldFocus) {
      ReactDOM.findDOMNode(this.cardNode).scrollIntoView({block: 'end', behavior: 'smooth'});
    }
  }

  render() {
    return (
      <Card style={styles.card} ref={(node) => { this.cardNode = node; }}>
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
