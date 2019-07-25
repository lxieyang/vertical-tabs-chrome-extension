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
  // borderRadius: '3px',
});

const containerClass = css({
  position: 'fixed',
  top: '0px',
  // right: '0px',
  height: '100%',
  padding: '0px 0px 0px 0px',
  boxSizing: 'border-box',
  borderRadius: '3px',
  boxShadow: '-1px 1px 8px rgba(0,0,0,.15)',
  transform: 'translateX(115%)',
  transition: 'transform .25s cubic-bezier(0, 0, 0.3, 1)',
  zIndex: 99999999,
});

const containerRightClass = css({
  right: '0px',
});

const containerLeftClass = css({
  left: '0px',
});

const containerVisibleClass = css({
  transform: 'translate3d(0,0,0)',
});

const containerMinimizedClass = css({
  cursor: 'pointer',
  '& > iframe': {
    pointerEvents: 'none',
  },
});

const containerRightMinimizedClass = css({
  transform: 'translateX(98%)',
  ':hover': {
    transform: `translateX(94%)`,
  },
});

const containerLeftMinimizedClass = css({
  transform: 'translateX(-98%)',
  ':hover': {
    transform: `translateX(-94%)`,
  },
});

const toggleButtonClass = css({
  position: 'fixed',
  zIndex: 9999999999,
});

const toggleButtonBottomRightClass = css({
  bottom: '40px',
  right: '30px',
});

const toggleButtonBottomRightInnerClass = css({
  bottom: '0px',
  right: '0px',
});

const toggleButtonTopRightClass = css({
  top: '40px',
  right: '30px',
});

const toggleButtonTopRightInnerClass = css({
  top: '0px',
  right: '0px',
});

const toggleButtonBottomLeftClass = css({
  bottom: '40px',
  left: '30px',
});

const toggleButtonBottomLeftInnerClass = css({
  bottom: '0px',
  left: '0px',
});

const toggleButtonTopLeftClass = css({
  top: '40px',
  left: '30px',
});

const toggleButtonTopLeftInnerClass = css({
  top: '0px',
  left: '0px',
});

const toggleButtonInnerClass = css({
  position: 'absolute',
  // right: '0px',
  // bottom: '0px',
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
  color: 'black',
  userSelect: 'none',
  borderRadius: '6px',
  boxShadow: '-1px 1px 8px rgba(0,0,0,.2)',
  transition: 'all 0.3s',
  opacity: 0.3,
  ':hover': {
    width: '200px',
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
      children,
      containerChildren,
      viewportWidth,
      sidebarLocation,
      toggleButtonLocation,
    } = this.props;

    return (
      <React.Fragment>
        {!isDragging && (
          <div
            className={cx({
              [toggleButtonClass]: true,
              [toggleButtonTopRightClass]:
                toggleButtonLocation === 'top' && sidebarLocation === 'right',
              [toggleButtonBottomRightClass]:
                toggleButtonLocation === 'bottom' &&
                sidebarLocation === 'right',
              [toggleButtonTopLeftClass]:
                toggleButtonLocation === 'top' && sidebarLocation === 'left',
              [toggleButtonBottomLeftClass]:
                toggleButtonLocation === 'bottom' && sidebarLocation === 'left',
            })}
            title={`${
              this.state.isMinimized ? 'Open' : 'Hide'
            } ${APP_NAME_SHORT} sidebar`}
          >
            <div
              className={cx({
                [toggleButtonInnerClass]: true,
                [toggleButtonTopRightInnerClass]:
                  toggleButtonLocation === 'top' && sidebarLocation === 'right',
                [toggleButtonBottomRightInnerClass]:
                  toggleButtonLocation === 'bottom' &&
                  sidebarLocation === 'right',
                [toggleButtonTopLeftInnerClass]:
                  toggleButtonLocation === 'top' && sidebarLocation === 'left',
                [toggleButtonBottomLeftInnerClass]:
                  toggleButtonLocation === 'bottom' &&
                  sidebarLocation === 'left',
              })}
              style={{ margin: '3px' }}
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
                {sidebarLocation === 'left' && (
                  <>
                    <div style={{ width: '20px' }}>
                      <Logo size={'20px'} />
                    </div>
                    <FontAwesomeIcon
                      icon={
                        this.state.isMinimized ? faChevronRight : faChevronLeft
                      }
                      style={{ marginLeft: '5px', color: 'rgb(233, 115, 46)' }}
                    />
                    <div style={{ marginLeft: '5px' }}>
                      {` ${
                        this.state.isMinimized ? 'Open' : 'Close'
                      } Vertical Tabs`}
                    </div>
                  </>
                )}

                {sidebarLocation === 'right' && (
                  <>
                    <FontAwesomeIcon
                      icon={
                        this.state.isMinimized ? faChevronLeft : faChevronRight
                      }
                      style={{ marginRight: '5px', color: 'rgb(233, 115, 46)' }}
                    />
                    <div style={{ width: '20px' }}>
                      <Logo size={'20px'} />
                    </div>
                    <div style={{ marginLeft: '5px' }}>
                      {` ${
                        this.state.isMinimized ? 'Open' : 'Close'
                      } Vertical Tabs`}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        <div
          id="nice"
          className={cx({
            [containerClass]: true,
            [containerLeftClass]: sidebarLocation === 'left',
            [containerRightClass]: sidebarLocation === 'right',
            [containerVisibleClass]: isVisible,
            [containerMinimizedClass]: isMinimized,
            [containerLeftMinimizedClass]:
              isMinimized && sidebarLocation === 'left',
            [containerRightMinimizedClass]:
              isMinimized && sidebarLocation === 'right',
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
              right: isMinimized && sidebarLocation === 'left' ? false : true,
              bottom: false,
              left: isMinimized && sidebarLocation === 'right' ? false : true,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            style={{
              borderLeft:
                this.state.isDragging && sidebarLocation === 'right'
                  ? '4px solid rgb(233, 115, 46)'
                  : null,
              borderRight:
                this.state.isDragging && sidebarLocation === 'left'
                  ? '4px solid rgb(233, 115, 46)'
                  : null,
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
            <div
              style={{
                display: 'flex',
                height: '100%',
              }}
            >
              {/* <div
                style={{
                  order:
                    sidebarLocation === 'left'
                      ? 2
                      : sidebarLocation === 'right'
                      ? 1
                      : null,
                  width: !isMinimized ? '15px' : '40px',
                  height: '100%',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                }}
                onClick={(e) => {
                  this.onFrameClick();
                }}
              ></div> */}
              <div
                style={{
                  flex: '1',
                }}
              >
                <iframe
                  title={'vt-sidebar-iframe'}
                  className={cx({
                    [iframeClass]: true,
                  })}
                  src={url}
                  ref={(frame) => (this.frame = frame)}
                  onLoad={this.onLoad}
                />
              </div>
            </div>
          </Resizable>

          {containerChildren}
        </div>

        {children}
      </React.Fragment>
    );
  }
}

export default Frame;
