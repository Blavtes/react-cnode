import React, {Component} from 'react';

const defaultStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  overflow: 'scroll'
};

export default class PullView extends Component {

  constructor() {
    super(...arguments);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.setPulledY = this.setPulledY.bind(this);
  }

  componentDidMount() {
    const {props: {mountScrollTop}, container} = this;
    container.scrollTop = mountScrollTop;
    this.container.addEventListener('touchmove', this.onTouchMove);
  }

  componentWillUnmount() {
    const {props: {componentWillUnmount}, container} = this;
    componentWillUnmount && componentWillUnmount(container.scrollTop);
  }

  state = {
    startY: undefined,
    endY: undefined,
    pulling: false,
    pulledY: 0,
    ifPause: false
  };

  onTouchStart(e) {
  }

  onTouchMove(e) {
    const {container,
      state: {pulling, startY, ifPause},
      props: {onPulling, onPullingPause, onScrollToBottom, scaleY = 0.2, toBottom = 0}} = this;
    const eTouchScreenY = e.touches[0].screenY;

    if (pulling) {
      const pulledY = (eTouchScreenY - startY) * scaleY;

      if (pulledY >= 0) {
        this.setState({
          endY: eTouchScreenY,
          pulledY: pulledY
        });

        if (ifPause) {
          onPullingPause && onPullingPause(pulledY);
        } else {
          onPulling && onPulling(pulledY);
        }

        e.preventDefault();
      } else {
        if (ifPause) {
          this.setState({
            pulledY: 0,
            ifPause: false
          });
        } else {
          this.setState({
            pulledY: 0
          });
        }
      }
    } else {
      if (container.scrollTop === 0) {
        this.setState({
          startY: eTouchScreenY,
          pulling: true
        });
      } else if (container.scrollTop + container.clientHeight + toBottom >= container.scrollHeight) {
        onScrollToBottom && onScrollToBottom();
      }
    }
  }

  onTouchEnd() {
    const {props: {onPullEnd, pulledPauseY = 0}, state: {pulling, pulledY}} = this;

    if (pulling) {
      const ifPause = onPullEnd ? onPullEnd(pulledY) : false;

      this.setState({
        pulling: ifPause,
        pulledY: ifPause ? pulledPauseY : 0,
        ifPause
      });
    }
  }

  setPulledY(y) {
    this.setState({
      pulledY: y
    });
  }

  render() {
    const {props: {children, style}, state: {pulledY}, onTouchStart, onTouchEnd} = this;

    return (
      <div
        style={{
          ...defaultStyle,
          ...style,
          transform: `translate3d(0px, ${pulledY}px, 0px)`
        }}
        ref={(container) => this.container = container}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
        {children}
      </div>
    )
  }
}
