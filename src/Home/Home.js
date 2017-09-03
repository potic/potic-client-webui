import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import config from 'config';
import axios from 'axios';

class Home extends Component {
  login() {
    this.props.auth.login();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        {
          isAuthenticated() && (
            <MuiThemeProvider>
              <PocketSquareGrid {...this.props} />
            </MuiThemeProvider>
            )
        }
        {
          !isAuthenticated() && (
              <h4>
                You are not logged in! Please{' '}
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

const initSections = [
  {
    title: 'Getting started',
    firstChunk: {
    articles: [{
      img: 'images/grid-list/00-52-29-429_640.jpg',
      title: 'Breakfast',
      author: 'jill111',
      mainImage: {
        src: "../images/yeoman.png"
      },
      id: "1",
      source: "aaa",
      excerpt: "aaa"
    },
    {
      img: 'images/grid-list/burger-827309_640.jpg',
      title: 'Tasty burger',
      author: 'pashminu',
      mainImage: {
        src: "../images/yeoman.png"
      },
      id: "2",
      source: "aaa",
      excerpt: "aaa"
    },
    {
      img: 'images/grid-list/camera-813814_640.jpg',
      title: 'Camera',
      author: 'Danson67',
      mainImage: {
        src: "../images/yeoman.png"
      },
      id: "3",
      source: "aaa",
      excerpt: "aaa"
    },
    {
      img: 'images/grid-list/morning-819362_640.jpg',
      title: 'Morning',
      author: 'fancycrave1',
      mainImage: {
        src: "../images/yeoman.png"
      },
      id: "4",
      source: "aaa",
      excerpt: "aaa"
    }]
    }
  }
  ];

class PocketSquareGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: initSections,
      blacklistedCards: [],
      nextPage: 0,
      size: 12,
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.fetchCardData = this.fetchCardData.bind(this);
    this.markCardAsRead = this.markCardAsRead.bind(this);
  }

  markCardAsRead(id, section_ind) {
    this.setState({
      focusCardId: "",
      sections: this.state.sections,
      size: this.state.size,
      nextPage: this.state.nextPage,
      blacklistedCards: this.state.blacklistedCards.concat([id])});
    this.fetchCardData(section_ind, 1, false);
    this.postMarkCardAsRead(id);
  }

  postMarkCardAsRead(id) {
    console.log('MARK CARD AS READ');

    const { getAccessToken } = this.props.auth;
    const headers = { 'Authorization': `Bearer ${getAccessToken()}`}

    axios.post(`${config.services_articles}/user/me/article/${id}/markAsRead`, {}, { headers })
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


  handleScroll() {
    /*
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.fetchData();
      console.log('bottom reached');
    }
    */
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
