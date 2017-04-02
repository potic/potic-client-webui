import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import axios from 'axios';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
  }
};

const initPosts = [
  {
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
  }
  ];


class PocketSquareGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: initPosts
    };
  }

  componentDidMount() {
    console.log('START FETCH');
    axios.get('http://188.166.174.189:28104/sort/58b1800dc9e77c0001d1d702?count=12')
      .then(res => {
        const posts = res.data;
        console.log(res);
        this.setState({ posts });
      });
  }

  render() {
    const cols = 4;
    const rows = Math.floor(this.state.posts.length / cols);
    return (
      <div>
        {Array(rows).fill().map((_, i) => (
         <div style={styles.root}>
            <GridList style={styles.gridList} cellHeight='auto'>
              {this.state.posts.slice(i*cols, (i+1)*cols).map((post) => (
                <PocketSquareCard post={post} key={post.id} />
              ))}
            </GridList>
          </div>
         ))}
      </div>
    );
  }
}

class GridListExampleSingleLine extends React.Component {
  constructor(props) {
      super(props);
  }

  render() {
    return (
      <div style={styles.root}>
        <GridList style={styles.gridList} cellHeight='auto'>
          {this.props.posts.map((post) => (
            <PocketSquareCard post={post} />
          ))}
        </GridList>
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
      <Card>
        <CardMedia>
          <img src={this.props.post.mainImage ? this.props.post.mainImage.src  : null} />
        </CardMedia>
        <CardTitle title={this.props.post.title} subtitle={this.props.post.source} />
        <CardText>
          {this.props.post.excerpt}
        </CardText>
        <CardActions>
          <FlatButton label="@pocket" />
          <FlatButton label="mark as read" />
        </CardActions>
      </Card>
    );
  }
};

const AppComponent = () => (
  <MuiThemeProvider>
    <PocketSquareGrid />
  </MuiThemeProvider>
);

AppComponent.defaultProps = {
};

export default AppComponent;

