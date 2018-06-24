import React from 'react';
import PoticCard from '../PoticCard/PoticCard';
import StackGrid from 'react-stack-grid';
import FlatButton from 'material-ui/FlatButton';

class PoticSection extends React.Component {

  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    var element = event.target.scrollingElement;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        console.log('Pagination: fetch more');
        this.props.fetchCards(10, true);
    }
  }

  render() {
    return (
      <div>
          <StackGrid
            columnWidth={"20%"}
            monitorImagesLoaded={true}>
            {this.props.section['cards']
              .filter((post) => {return this.props.hiddenCards.indexOf(post.id) < 0;})
              .map((post) => (<PoticCard
                post={post}
                key={post.id}
                ref={(node) => {
                  if (this.props.focusCardId === post.id) {
                    this.cardNode = node;
                  }
                }}
                onMarkLiked={this.props.markCardLiked}
                onMarkDisliked={this.props.markCardDisliked}
              />))}
          </StackGrid>
      </div>
    );
  }
}

export default PoticSection;
