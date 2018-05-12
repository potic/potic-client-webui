import React from 'react';
import { Card, CardActions, CardMedia, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  card: {
    margin: 5,
    width: 300,
    minWidth: 300
  },
  cardInner: {
    display: 'flex',
    flexDirection: 'column',
    height: 480,
    justifyContent: 'flex-end',
    overflowY: 'hidden'
  },
  media: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    overflowY: 'hidden'
  },
  title: {
    lineHeight: 1
  },
  link: {
    textDecoration:'none'
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
            <CardTitle title={this.props.post.title} subtitle={this.props.post.source + this.timestampToString(this.props.post.addedTimestamp)} titleStyle={styles.title} />
          </a>

          <CardActions>
            <FlatButton label="like" onClick={() => this.props.onMarkLiked(this.props.post.id)} />
            <FlatButton label="dislike" onClick={() => this.props.onMarkDisliked(this.props.post.id)} />
          </CardActions>

        </div>
      </Card>
    );
  }

  timestampToString(timestamp) {
    if (timestamp == null) {
      return '';
    }

    const secondsAgo = new Date().getTime() / 1000 - timestamp;

    const minutesAgo = secondsAgo / 60;
    if (minutesAgo == 0) {
      return ` · now`;
    }
    if (minutesAgo < 60) {
      return ` · ${Math.floor(minutesAgo)} minute${Math.floor(minutesAgo) > 1 ? 's' : ''} ago`;
    }

    const hoursAgo = minutesAgo / 60;
    if (hoursAgo < 24) {
      return ` · ${Math.floor(hoursAgo)} hour${Math.floor(hoursAgo) > 1 ? 's' : ''} ago`;
    }

    const daysAgo = hoursAgo / 24;
    if (daysAgo < 7) {
      return ` · ${Math.floor(daysAgo)} day${Math.floor(daysAgo) > 1 ? 's' : ''} ago`;
    }

    const weeksAgo = daysAgo / 7;
    if (weeksAgo < 6) {
      return ` · ${Math.floor(weeksAgo)} week${Math.floor(weeksAgo) > 1 ? 's' : ''} ago`;
    }

    const monthsAgo = daysAgo / 30;
    if (monthsAgo < 12) {
      return ` · ${Math.floor(monthsAgo)} month${Math.floor(monthsAgo) > 1 ? 's' : ''} ago`;
    }

    const yearsAgo = monthsAgo / 12;
    return ` · ${Math.floor(yearsAgo)} year${Math.floor(yearsAgo) > 1 ? 's' : ''} ago`;
  }
}

export default PoticCard;
