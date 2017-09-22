import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Subheader from 'material-ui/Subheader';
import FlatButton from 'material-ui/FlatButton';
import PoticCard from '../PoticCard/PoticCard';

const styles = {
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
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

class PoticSection extends React.Component {
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
             .map((post) => (<PoticCard
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

export default PoticSection;
