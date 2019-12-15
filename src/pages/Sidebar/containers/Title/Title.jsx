import React, { Component } from 'react';
import Popover, { ArrowContainer } from 'react-tiny-popover';
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
      } else if (
        request.from === 'background' &&
        request.msg === 'UPDATE_SHOULD_SHRINK_BODY_STATUS'
      ) {
        const { toStatus } = request;
        this.setState({ settingSidebarShouldShrinkBody: toStatus === true });
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

  render() {
    const {
      sidebarOnLeft,
      isSettingsPopoverOpen,
      settingSidebarLocation,
      settingSidebarShouldShrinkBody,
      settingDisplayTabTitleInFull,
    } = this.state;

    return (
      <DarkModeContext.Consumer>
        {(darkModeContext) => {
          return (
            <div
              className={[
                'TitleContainer',
                darkModeContext.isDark ? 'Dark' : null,
              ].join(' ')}
            >
              <div className="TitleLogoContainer">
                <Logo size={'20px'} />
              </div>
              <div className="TitleNameContainer">{APP_NAME_FULL}</div>

              <Popover
                isOpen={isSettingsPopoverOpen}
                position={['bottom']}
                padding={0}
                // windowBorderPadding={10}
                disableReposition={false}
                onClickOutside={() =>
                  this.setState({ isSettingsPopoverOpen: false })
                }
                containerStyle={{
                  zIndex: 999999999,
                  minWidth: '180px',
                  maxWidth: '220px',
                  padding: '0px 2px 2px 2px',
                }}
                content={({ position, targetRect, popoverRect }) => (
                  <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                    className="123"
                    position={position}
                    targetRect={targetRect}
                    popoverRect={popoverRect}
                    arrowColor={'#ebebeb'}
                    arrowSize={4}
                  >
                    <SettingsBox
                      settingSidebarLocation={settingSidebarLocation}
                      setSettingSidebarLocation={this.setSettingSidebarLocation}
                      settingSidebarShouldShrinkBody={
                        settingSidebarShouldShrinkBody
                      }
                      setSettingSidebarShouldShrinkBody={
                        this.setSettingSidebarShouldShrinkBody
                      }
                      settingDisplayTabTitleInFull={
                        settingDisplayTabTitleInFull
                      }
                      setSettingDisplayTabTitleInFull={
                        this.setSettingDisplayTabTitleInFull
                      }
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
                    className={[
                      'ActionButton',
                      darkModeContext.isDark ? 'Dark' : null,
                    ].join(' ')}
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
