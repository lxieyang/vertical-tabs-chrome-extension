import React, { Component } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { MdChevronRight } from 'react-icons/md';

import Logo from '../../../../components/Logo/Logo';
import { APP_NAME_FULL } from '../../../../shared/constants';

import './Title.css';

class Title extends Component {
  state = {
    sidebarOnLeft: null,
  };

  componentDidMount() {
    chrome.storage.sync.get(['sidebarOnLeft'], (result) => {
      if (result.sidebarOnLeft !== undefined) {
        this.setState({
          sidebarOnLeft: result.sidebarOnLeft === true,
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

  render() {
    const { sidebarOnLeft } = this.state;
    return (
      <div className="TitleContainer">
        <div className="TitleLogoContainer">
          <Logo size={'20px'} />
        </div>
        <div className="TitleNameContainer">{APP_NAME_FULL}</div>
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
