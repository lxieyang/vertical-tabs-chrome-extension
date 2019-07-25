import React, { Component } from 'react';
import cx from 'classnames';
import { css } from 'glamor';
import { node, object, string, number, func } from 'prop-types';

import { APP_NAME_SHORT } from '../../../shared//constants';
import Logo from '../../../components/Logo/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Resizable } from 're-resizable';
import styles from './frame.css';

const iframeClass = css({
  border: 'none',
  width: '100%',
  height: '100%',
  background: 'white',
  boxSizing: 'border-box',
  borderRadius: '3px',
  boxShadow: '-1px 1px 8px rgba(0,0,0,.15)',
});

const containerClass = css({
  position: 'fixed',
  top: '0px',
  right: '0px',
  height: '100%',
  padding: '3px 3px 3px 0px',
  boxSizing: 'border-box',
  borderRadius: '3px',
  transform: 'translateX(115%)',
  transition: 'transform .25s cubic-bezier(0, 0, 0.3, 1)',
  zIndex: 99999999,
});

const containerVisibleClass = css({
  transform: 'translate3d(0,0,0)',
});

const containerMinimizedClass = css({
  cursor: 'pointer',
  transform: 'translateX(98%)',
  ':hover': {
    transform: 'translateX(94%)',
  },
  '& > iframe': {
    pointerEvents: 'none',
  },
});

const toggleButtonClass = css({
  position: 'fixed',
  bottom: '40px',
  right: '30px',
  zIndex: 9999999999,
});

const toggleButtonInnerClass = css({
  position: 'absolute',
  right: '0px',
  bottom: '0px',
  width: '45px',
  height: '35px',
  boxSizing: 'border-box',
  cursor: 'pointer',
  padding: '2px 5px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  fontSize: '16px',
  fontFamily: 'arial',
  backgroundColor: 'white',
  color: 'rgb(193, 40, 27)',
  borderRadius: '6px',
  boxShadow: '-1px 1px 8px rgba(0,0,0,.2)',
  transition: 'all 0.3s',
  opacity: 0.3,
  ':hover': {
    width: '210px',
    opacity: 1,
  },
});

const FRAME_TOGGLE_FUNCTION = 'chromeIframeSheetToggle';

export class Frame extends Component {
  state = {
    isVisible: false,
    isMinimized: true, // default is minimized,

    isDragging: false,
    width: 250,
    height: '100%',
  };

  static defaultProps = {
    url: '',
    delay: 500,
    maskClassName: '',
    maskStyle: {},
    containerClassName: '',
    containerStyle: {},
    iframeClassName: '',
    iframeStyle: {},
    onMount: () => {},
    onUnmount: () => {},
    onLoad: () => {},
  };

  static propTypes = {
    url: string,
    delay: number,
    maskClassName: string,
    maskStyle: object,
    containerClassName: string,
    containerStyle: object,
    iframeClassName: string,
    iframeStyle: object,
    children: node,
    containerChildren: node,
    onMount: func,
    onUnmount: func,
    onLoad: func,
  };

  componentDidMount() {
    const { delay, onMount } = this.props;

    window[FRAME_TOGGLE_FUNCTION] = this.toggleFrame;

    onMount({
      mask: this.mask,
      frame: this.frame,
    });

    this._visibleRenderTimeout = setTimeout(() => {
      this.setState({
        isVisible: true,
      });
    }, delay);

    try {
      let widthObj = localStorage.getItem('vt-sidebar-width');
      if (widthObj !== undefined) {
        this.setState({ width: JSON.parse(widthObj).width });
      }
    } catch (e) {
      localStorage.removeItem('vt-sidebar-width');
    }
  }

  componentWillUnmount() {
    const { onUnmount } = this.props;

    onUnmount({
      mask: this.mask,
      frame: this.frame,
    });

    delete window[FRAME_TOGGLE_FUNCTION];
    clearTimeout(this._visibleRenderTimeout);
  }

  onLoad = () => {
    const { onLoad } = this.props;

    onLoad({
      mask: this.mask,
      frame: this.frame,
    });
  };

  toggleMinimizedStatus = (e) => {
    // e.stopPropagation();
    window[FRAME_TOGGLE_FUNCTION]();
  };

  onFrameClick = () => {
    this.toggleFrame();
  };

  toggleFrame = (to = undefined) => {
    if (to === undefined) {
      this.setState((prevState) => {
        this.props.shrinkBody(prevState.isMinimized);
        return { isMinimized: !prevState.isMinimized };
      });
    } else {
      this.props.shrinkBody(!to);
      this.setState({ isMinimized: to });
    }
  };

  static isReady() {
    return typeof window[FRAME_TOGGLE_FUNCTION] !== 'undefined';
  }

  static toggle(to = undefined) {
    if (window[FRAME_TOGGLE_FUNCTION]) {
      window[FRAME_TOGGLE_FUNCTION](to);
    }
  }

  render() {
    const { isVisible, isMinimized, isDragging } = this.state;
    const {
      url,
      className,
      containerClassName,
      containerStyle,
      iframeClassName,
      iframeStyle,
      children,
      containerChildren,
      viewportWidth,
    } = this.props;

    return (
      <React.Fragment>
        {!isDragging && (
          <div
            className={cx({
              [toggleButtonClass]: true,
            })}
            title={`${
              this.state.isMinimized ? 'Open' : 'Hide'
            } ${APP_NAME_SHORT} sidebar`}
          >
            <div
              className={cx({
                [toggleButtonInnerClass]: true,
              })}
              style={{ margin: '5px' }}
              onClick={this.onFrameClick}
            >
              <div
                style={{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FontAwesomeIcon
                  icon={this.state.isMinimized ? faChevronLeft : faChevronRight}
                  style={{ marginRight: '5px' }}
                />
                <div style={{ width: '20px' }}>
                  <Logo size={'20px'} />
                </div>
                <div style={{ marginLeft: '5px' }}>
                  {` ${
                    this.state.isMinimized ? 'Open' : 'Close'
                  } ${APP_NAME_SHORT} sidebar`}
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          className={cx({
            [containerClass]: true,
            [containerVisibleClass]: isVisible,
            [containerMinimizedClass]: isMinimized,
            [containerClassName]: true,
          })}
          style={{
            ...containerStyle,
          }}
        >
          <Resizable
            minWidth={Math.min(250, viewportWidth - 20)}
            maxWidth={Math.min(800, viewportWidth - 20)}
            size={{ width: this.state.width, height: this.state.height }}
            enable={{
              top: false,
              right: false,
              bottom: false,
              left: isMinimized ? false : true,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            style={{
              borderLeft: this.state.isDragging ? '4px solid #2196F3' : null,
            }}
            // onResize={e => {
            //   e.stopPropagation();
            // }}
            onResizeStart={(e) => {
              this.setState({ isDragging: true });
            }}
            onResizeStop={(e, direction, ref, d) => {
              let width =
                parseInt(this.state.width, 10) + parseInt(d.width, 10);
              this.setState({
                width: width,
                isDragging: false,
              });
              localStorage.setItem(
                'vt-sidebar-width',
                JSON.stringify({ width: width })
              );
            }}
          >
            <iframe
              title={'vt-sidebar-iframe'}
              className={cx({
                [iframeClass]: true,
                [iframeClassName]: true,
              })}
              style={iframeStyle}
              src={url}
              ref={(frame) => (this.frame = frame)}
              onLoad={this.onLoad}
            />
          </Resizable>

          {containerChildren}
        </div>

        {children}
      </React.Fragment>
    );
  }
}

export default Frame;
