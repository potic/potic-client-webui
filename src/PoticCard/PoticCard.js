import React, { Component } from 'react';
import {Card, CardActions, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const styles = {
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
};

class PoticCard extends React.Component {

  constructor(props) {
      super(props);
  }

  render() {
    return (
      <Card style={styles.card} >
        <div style={styles.cardInner}>
          <CardMedia style={styles.media}>
            <img src={this.props.post.image ? this.props.post.image.src : null} />
          </CardMedia>
          <a href={this.props.post.url} style={styles.link} target="_blank">
            <CardTitle title={this.props.post.title} subtitle={this.props.post.source} titleStyle={styles.title} />
          </a>
          <CardText>
            {this.props.post.excerpt}
          </CardText>
          <CardActions>
            <FlatButton label="@pocket" href={`https://getpocket.com/a/read/${this.props.post.pocketId}`} target="_blank" />
            <FlatButton label="read" onClick={() => this.props.onMarkAsRead(this.props.post.id)} />
            <FlatButton label="archive" onClick={() => this.props.onMarkAsArchived(this.props.post.id)} />
          </CardActions>
        </div>
      </Card>
    );
  }
};

export default PoticCard;
