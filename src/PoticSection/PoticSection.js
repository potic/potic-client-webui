import React from 'react';
import PoticCard from '../PoticCard/PoticCard';
import StackGrid from 'react-stack-grid';
import FlatButton from 'material-ui/FlatButton';

class PoticSection extends React.Component {

  constructor(props) {
      super(props);
  }

  render() {
    return (
      <div>
        <div>
          <div>
            <FlatButton label="Load more..." onClick={() => {this.props.fetchCards(5, true)}}/>
          </div>
        </div>

        <div>
          <StackGrid
            columnWidth={"20%"}
          >
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
      </div>
    );
  }
}

export default PoticSection;
