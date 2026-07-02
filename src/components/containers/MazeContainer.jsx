import React from 'react';
import MazeGraph from '../../../src/maze/MazeGraph';

export default class MazeContainer extends React.Component {
  state = {};

  componentDidMount = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
    });
  };

  render() {
    return (
      <>
        <MazeGraph
          className="mz-container"
          height={this.state.windowHeight}
          width={this.state.windowWidth}
          handleswipebindings={this.handleSwipeBindings}
        />
      </>
    );
  }
}
