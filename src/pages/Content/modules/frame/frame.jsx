import React, { Component } from 'react';
import cx from 'classnames';
import { css } from 'glamor';
import { node, object, string, number, func } from 'prop-types';

import { Resizable } from 're-resizable';

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
  // transform: 'translateX(115%)',
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
  transform: 'translateX(100%)',
  // ':hover': {
  //   transform: `translateX(94%)`,
  // },
});

const containerLeftMinimizedClass = css({
  transform: 'translateX(-100%)',
  // ':hover': {
  //   transform: `translateX(-94%)`,
  // },
});

const FRAME_TOGGLE_FUNCTION = 'chromeIframeSidebarToggle';
const FRAME_FIX_SHRINK_BODY_FUNCTION = 'chromeIframeFixShrinkBody';

export class Frame extends Component {
  state = {
    isVisible: false,
    isMinimized: true, // default is minimized,

    isDragging: false,
    width: 320,
    height: '100%',
    loaded: false,
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
    window[FRAME_FIX_SHRINK_BODY_FUNCTION] = this.fixShrinkBody;

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
      chrome.storage.sync.get(['vt-sidebar-width'], (result) => {
        let widthObj = result['vt-sidebar-width'];
        if (widthObj !== undefined) {
          let width = JSON.parse(widthObj).width;
          if (width) {
            this.setState({ width });
          }
        }
      });
      // let widthObj = localStorage.getItem('vt-sidebar-width');
      // if (widthObj !== undefined) {
      //   this.setState({ width: JSON.parse(widthObj).width });
      // }
    } catch (e) {
      chrome.storage.sync.remove(['vt-sidebar-width']);
      // localStorage.removeItem('vt-sidebar-width');
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (
        request.from === 'background' &&
        request.msg === 'UPDATE_SIDEBAR_WIDTH'
      ) {
        // console.log(parseInt(request.width));
        this.setState({ width: parseInt(request.width) });
      }
    });
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

    this.setState({ loaded: true });

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
      this.props.shrinkBody(to);
      this.setState({ isMinimized: !to });
    }
  };

  fixShrinkBody = () => {
    this.props.fixShrinkBody(!this.state.isMinimized);
  };

  static isReady() {
    return typeof window[FRAME_TOGGLE_FUNCTION] !== 'undefined';
  }

  static toggle(to = undefined) {
    if (window[FRAME_TOGGLE_FUNCTION]) {
      window[FRAME_TOGGLE_FUNCTION](to);
    }
  }

  static shrinkBody() {
    if (window[FRAME_FIX_SHRINK_BODY_FUNCTION]) {
      window[FRAME_FIX_SHRINK_BODY_FUNCTION]();
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
              right: !isMinimized && sidebarLocation === 'left' ? true : false,
              bottom: false,
              left: !isMinimized && sidebarLocation === 'right' ? true : false,
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
              // borderImage:
              //   'linear-gradient(red, orange, yellow, green, blue, indigo, violet) 40',
              borderImage:
                'linear-gradient(rgba(255,131,7,1) 0%,rgba(255,176,112,1) 100%) 30',
            }}
            onResize={(e, direction, ref, d) => {
              let width =
                parseInt(this.state.width, 10) + parseInt(d.width, 10);
              this.props.setSidebarWidth(width);
              this.props.shrinkBody(true);
            }}
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

              this.props.setSidebarWidth(width);
              this.props.shrinkBody(true);

              chrome.storage.sync.set({
                'vt-sidebar-width': JSON.stringify({ width: width }),
              });
              // localStorage.setItem(
              //   'vt-sidebar-width',
              //   JSON.stringify({ width: width })
              // );

              chrome.runtime.sendMessage({
                from: 'content',
                msg: 'WIDTH_CHANGED',
                width,
              });
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
                  style={{
                    backgroundImage: !this.state.loaded
                      ? `url(${chrome.extension.getURL(
                          'iframe-background.gif'
                        )})`
                      : null,
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    height: '100vh',
                  }}
                  src={url}
                  ref={(frame) => (this.frame = frame)}
                  onLoad={this.onLoad}
                  onMouseEnter={() => {
                    // TODO: implement auto show/hide here
                    console.log('mouse entered');
                  }}
                  onMouseLeave={() => {
                    // TODO: implement auto show/hide here
                    console.log('mouse left');
                  }}
                ></iframe>
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
