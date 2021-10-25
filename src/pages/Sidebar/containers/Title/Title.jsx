import React, { Component } from 'react';
import classNames from 'classnames';
import { Popover, ArrowContainer } from 'react-tiny-popover';
import { MdChevronLeft } from 'react-icons/md';
import { MdChevronRight } from 'react-icons/md';
import { MdSettings } from 'react-icons/md';

import Logo from '../../../../components/Logo/Logo';
import { APP_NAME_FULL } from '../../../../shared/constants';

import SettingsBox from './SettingsBox/SettingsBox';

import './Title.css';

import DarkModeContext from '../../context/dark-mode-context';

class Title extends Component {
  state = {
    sidebarOnLeft: null,
    isSettingsPopoverOpen: false,

    // settings
    settingSidebarLocation: 'left',
    settingSidebarShouldShrinkBody: true,
    settingDisplayTabTitleInFull: true,
    settingDisplayTabPreviewFrame: true,
    settingAutoShowHide: false,
    settingAutoShowHideDelay: 500,
    settingDarkMode: 'auto',
  };

  componentDidMount() {
    chrome.storage.sync.get(['sidebarOnLeft'], (result) => {
      if (result.sidebarOnLeft !== undefined) {
        this.setState({
          sidebarOnLeft: result.sidebarOnLeft === true,
          settingSidebarLocation:
            result.sidebarOnLeft === true ? 'left' : 'right',
        });
      }
    });

    chrome.storage.sync.get(['shouldShrinkBody'], (result) => {
      if (result.shouldShrinkBody !== undefined) {
        this.setState({
          settingSidebarShouldShrinkBody: result.shouldShrinkBody === true,
        });
      }
    });

    chrome.storage.sync.get(['displayTabInFull'], (result) => {
      if (result.displayTabInFull !== undefined) {
        this.setState({
          settingDisplayTabTitleInFull: result.displayTabInFull === true,
        });
        this.props.setDisplayTabInFull(result.displayTabInFull === true);
      }
    });

    chrome.storage.sync.get(['displayTabPreviewFrame'], (result) => {
      if (result.displayTabPreviewFrame !== undefined) {
        this.setState({
          settingDisplayTabPreviewFrame: result.displayTabPreviewFrame === true,
        });
        this.props.setDisplayTabPreviewFrame(
          result.displayTabPreviewFrame === true
        );
      }
    });

    chrome.storage.sync.get(['autoShowHide'], (result) => {
      if (result.autoShowHide !== undefined) {
        this.setState({
          settingAutoShowHide: result.autoShowHide === true,
        });
      }
    });

    chrome.storage.sync.get(['autoShowHideDelay'], (result) => {
      if (result.autoShowHideDelay !== undefined) {
        this.setState({
          settingAutoShowHideDelay: result.autoShowHideDelay,
        });
      }
    });

    chrome.storage.sync.get(['darkMode'], (result) => {
      if (result.darkMode !== undefined) {
        this.setState({
          settingDarkMode: result.darkMode,
        });

        if (result.darkMode !== 'auto') {
          this.context.setDarkStatus(result.darkMode === 'dark');
        } else {
          this.context.setDarkStatus(this.context.mediaQueryDark);
        }
      }
    });

    // sync settings across tabs
    chrome.runtime.onMessage.addListener((request, sender, response) => {
      // no need to sync sidebarOnLeft here,
      // since the sidebar will be unmounted and remounted every time
      // the sidebarOnLeft status changes
      // by the content scripts
      if (
        request.from === 'background' &&
        request.msg === 'UPDATE_DISPLAY_TAB_IN_FULL_STATUS'
      ) {
        const { toStatus } = request;
        this.setState({
          settingDisplayTabTitleInFull: toStatus === true,
        });
        this.props.setDisplayTabInFull(toStatus === true);
      }
      if (
        request.from === 'background' &&
        request.msg === 'UPDATE_DISPLAY_TAB_PREVIEW_FRAME_STATUS'
      ) {
        const { toStatus } = request;
        this.setState({
          settingDisplayTabPreviewFrame: toStatus === true,
        });
        this.props.setDisplayTabPreviewFrame(toStatus === true);
      } else if (
        request.from === 'background' &&
        request.msg === 'UPDATE_SHOULD_SHRINK_BODY_STATUS'
      ) {
        const { toStatus } = request;
        this.setState({ settingSidebarShouldShrinkBody: toStatus === true });
      } else if (
        request.from === 'background' &&
        request.msg === 'UPDATE_AUTO_SHOW_HIDE_STATUS'
      ) {
        const { toStatus } = request;
        this.setState({ settingAutoShowHide: toStatus === true });
      } else if (
        request.from === 'background' &&
        request.msg === 'UPDATE_AUTO_SHOW_HIDE_DELAY_STATUS'
      ) {
        const { toStatus } = request;
        this.setState({ settingAutoShowHideDelay: toStatus });
      } else if (
        request.from === 'background' &&
        request.msg === 'UPDATE_DARK_MODE_STATUS'
      ) {
        const { toStatus } = request;
        this.setState({ settingDarkMode: toStatus });
      }
    });
  }

  closeSidebarClickedHandler = () => {
    chrome.runtime.sendMessage({
      from: 'content',
      msg: 'REQUEST_TOGGLE_SIDEBAR',
      toStatus: false,
    });
  };

  setSettingSidebarLocation = (toStatus) => {
    if (toStatus === this.state.settingSidebarLocation) {
      return;
    }

    this.setState({ settingSidebarLocation: toStatus });
    chrome.runtime.sendMessage({
      from: 'settings',
      msg: 'USER_CHANGE_SIDEBAR_LOCATION',
      toStatus,
    });
  };

  setSettingSidebarShouldShrinkBody = (toStatus) => {
    if (toStatus === this.state.settingSidebarShouldShrinkBody) {
      return;
    }

    this.setState({ settingSidebarShouldShrinkBody: toStatus });
    chrome.runtime.sendMessage({
      from: 'settings',
      msg: 'USER_CHANGE_SIDEBAR_SHOULD_SHRINK_BODY',
      toStatus,
    });
  };

  setSettingDisplayTabTitleInFull = (toStatus) => {
    if (toStatus === this.state.settingDisplayTabTitleInFull) {
      return;
    }

    this.setState({ settingDisplayTabTitleInFull: toStatus });
    chrome.runtime.sendMessage({
      from: 'settings',
      msg: 'USER_CHANGE_DISPLAY_TAB_TITLE_IN_FULL',
      toStatus,
    });
  };

  setSettingDisplayTabPreviewFrame = (toStatus) => {
    if (toStatus === this.state.settingDisplayTabPreviewFrame) {
      return;
    }

    this.setState({ settingDisplayTabPreviewFrame: toStatus });
    chrome.runtime.sendMessage({
      from: 'settings',
      msg: 'USER_CHANGE_DISPLAY_TAB_PREVIEW_FRAME',
      toStatus,
    });
  };

  setSettingAutoHideShow = (toStatus) => {
    if (toStatus === this.state.settingAutoShowHide) {
      return;
    }

    this.setState({ settingAutoShowHide: toStatus });
    chrome.runtime.sendMessage({
      from: 'settings',
      msg: 'USER_CHANGE_AUTO_SHOW_HIDE',
      toStatus,
    });
  };

  setSettingAutoShowHideDelay = (toStatus) => {
    if (toStatus === this.state.settingAutoShowHideDelay) {
      return;
    }

    this.setState({ settingAutoShowHideDelay: toStatus });
    chrome.runtime.sendMessage({
      from: 'settings',
      msg: 'USER_CHANGE_AUTO_SHOW_HIDE_DELAY',
      toStatus,
    });
  };

  static contextType = DarkModeContext;

  setSettingDarkMode = (toStatus) => {
    if (toStatus === this.state.settingDarkMode) {
      return;
    }

    if (toStatus !== 'auto') {
      this.context.setDarkStatus(toStatus === 'dark');
    } else {
      this.context.setDarkStatus(this.context.mediaQueryDark);
    }

    this.setState({ settingDarkMode: toStatus });
    chrome.runtime.sendMessage({
      from: 'settings',
      msg: 'USER_CHANGE_DARK_MODE',
      toStatus,
    });
  };

  render() {
    const {
      sidebarOnLeft,
      isSettingsPopoverOpen,
      settingSidebarLocation,
      settingSidebarShouldShrinkBody,
      settingDisplayTabTitleInFull,
      settingDisplayTabPreviewFrame,
      settingAutoShowHide,
      settingAutoShowHideDelay,
      settingDarkMode,
    } = this.state;

    return (
      <DarkModeContext.Consumer>
        {(darkModeContext) => {
          return (
            <div
              className={classNames({
                TitleContainer: true,
                Dark: darkModeContext.isDark,
              })}
            >
              <div className="TitleLogoContainer">
                <Logo size={'20px'} />
              </div>
              <div className="TitleNameContainer">{APP_NAME_FULL}</div>

              <Popover
                isOpen={isSettingsPopoverOpen}
                positions={['bottom']}
                padding={0}
                onClickOutside={() => {
                  this.setState({
                    isSettingsPopoverOpen: false,
                  });
                }}
                containerStyle={{
                  zIndex: 999999999,
                  minWidth: '180px',
                  maxWidth: '290px',
                  padding: '0px 2px 2px 2px',
                }}
                content={({ position, childRect, popoverRect }) => (
                  <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                    position={position}
                    childRect={childRect}
                    popoverRect={popoverRect}
                    arrowColor={'#ebebeb'}
                    arrowSize={4}
                  >
                    <SettingsBox
                      //
                      settingSidebarLocation={settingSidebarLocation}
                      setSettingSidebarLocation={this.setSettingSidebarLocation}
                      //
                      settingSidebarShouldShrinkBody={
                        settingSidebarShouldShrinkBody
                      }
                      setSettingSidebarShouldShrinkBody={
                        this.setSettingSidebarShouldShrinkBody
                      }
                      //
                      settingDisplayTabTitleInFull={
                        settingDisplayTabTitleInFull
                      }
                      setSettingDisplayTabTitleInFull={
                        this.setSettingDisplayTabTitleInFull
                      }
                      //
                      settingDisplayTabPreviewFrame={
                        settingDisplayTabPreviewFrame
                      }
                      setSettingDisplayTabPreviewFrame={
                        this.setSettingDisplayTabPreviewFrame
                      }
                      //
                      settingAutoShowHide={settingAutoShowHide}
                      setSettingAutoShowHide={this.setSettingAutoHideShow}
                      //
                      settingAutoShowHideDelay={settingAutoShowHideDelay}
                      setSettingAutoShowHideDelay={
                        this.setSettingAutoShowHideDelay
                      }
                      //
                      settingDarkMode={settingDarkMode}
                      setSettingDarkMode={this.setSettingDarkMode}
                    />
                  </ArrowContainer>
                )}
              >
                <div title="Settings" className="SettingIconConainer">
                  <MdSettings
                    className={[
                      'SettingIcon',
                      isSettingsPopoverOpen ? 'Open' : null,
                    ].join(' ')}
                    onClick={() =>
                      this.setState({
                        isSettingsPopoverOpen: !isSettingsPopoverOpen,
                      })
                    }
                  />
                </div>
              </Popover>

              <div style={{ flex: 1 }}></div>
              <div title="Hide" className="ActionButtonContainer">
                {sidebarOnLeft !== null && (
                  <div
                    className={classNames({
                      ActionButton: true,
                      Dark: darkModeContext.isDark,
                    })}
                    onClick={this.closeSidebarClickedHandler}
                  >
                    {sidebarOnLeft ? (
                      <MdChevronLeft size={'22px'} />
                    ) : (
                      <MdChevronRight size={'22px'} />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </DarkModeContext.Consumer>
    );
  }
}

export default Title;
