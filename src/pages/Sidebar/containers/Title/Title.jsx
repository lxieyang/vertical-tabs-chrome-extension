import React, { Component } from 'react';
import Popover, { ArrowContainer } from 'react-tiny-popover';
import { MdChevronLeft } from 'react-icons/md';
import { MdChevronRight } from 'react-icons/md';
import { MdSettings } from 'react-icons/md';

import Logo from '../../../../components/Logo/Logo';
import { APP_NAME_FULL } from '../../../../shared/constants';

import SettingsBox from './SettingsBox/SettingsBox';

import './Title.css';

class Title extends Component {
  state = {
    sidebarOnLeft: null,
    isSettingsPopoverOpen: false,

    // settings
    settingSidebarLocation: 'left',
    settingSidebarShouldShrinkBody: true,
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

  render() {
    const {
      sidebarOnLeft,
      isSettingsPopoverOpen,
      settingSidebarLocation,
      settingSidebarShouldShrinkBody,
    } = this.state;

    return (
      <div className="TitleContainer">
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
          onClickOutside={() => this.setState({ isSettingsPopoverOpen: false })}
          containerStyle={{
            zIndex: 999999999,
            minWidth: '180px',
            maxWidth: '220px',
            padding: '0px 2px 2px 2px',
          }}
          content={({ position, targetRect, popoverRect }) => (
            <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
              position={position}
              targetRect={targetRect}
              popoverRect={popoverRect}
              arrowColor={'#ebebeb'}
              arrowSize={10}
            >
              <SettingsBox
                settingSidebarLocation={settingSidebarLocation}
                setSettingSidebarLocation={this.setSettingSidebarLocation}
                settingSidebarShouldShrinkBody={settingSidebarShouldShrinkBody}
                setSettingSidebarShouldShrinkBody={
                  this.setSettingSidebarShouldShrinkBody
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
                this.setState({ isSettingsPopoverOpen: !isSettingsPopoverOpen })
              }
            />
          </div>
        </Popover>

        <div style={{ flex: 1 }}></div>
        <div title="Hide" className="ActionButtonContainer">
          {sidebarOnLeft !== null && (
            <div
              className="ActionButton"
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
  }
}

export default Title;
