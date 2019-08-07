import React, { Component } from 'react';
import update from 'immutability-helper';
import { sortBy } from 'lodash';

import Title from './containers/Title/Title';
import TabsList from './containers/TabsList/TabsList';
import Tab from './containers//TabsList/Tab/Tab';

import { getFavicon } from '../../shared/utils';

import './Sidebar.css';

class Sidebar extends Component {
  state = {
    tabOrders: [],
    activeTab: {},
    tabsDict: {},
  };

  componentDidMount() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const tabsDict = {};
      let tabOrders = [];
      tabs.forEach((tab) => {
        tab.faviconUrl = getFavicon(tab.url);
        tabsDict[tab.id] = {
          faviconUrl: tab.faviconUrl,
          // id: tab.id,
          title: tab.title,
          url: tab.url,
        };
        tabOrders.push({
          id: tab.id,
          index: tab.index,
          active: tab.active,
        });
        if (tab.active) {
          this.setState({
            activeTab: {
              id: tab.id,
              index: tab.index,
              active: tab.active,
            },
          });
        }
      });
      tabOrders = sortBy(tabOrders, ['index']);
      // console.log(tabOrders, tabsDict);
      this.setState({ tabOrders, tabsDict });
    });

    this.tabCreatedHandler = this.handleTabCreated.bind(this);
    this.tabRemovedHandler = this.handleTabRemoved.bind(this);
    this.tabUpdatedHandler = this.handleTabUpdated.bind(this);
    this.tabMovedHandler = this.handleTabMoved.bind(this);
    this.tabActivatedHandler = this.handleTabActivated.bind(this);
    this.tabHighlightedHandler = this.handleTabHighlighted.bind(this);

    chrome.tabs.onCreated.addListener(this.tabCreatedHandler);
    chrome.tabs.onRemoved.addListener(this.tabRemovedHandler);
    chrome.tabs.onUpdated.addListener(this.tabUpdatedHandler);
    chrome.tabs.onMoved.addListener(this.tabMovedHandler);
    chrome.tabs.onActivated.addListener(this.tabActivatedHandler);
    chrome.tabs.onHighlighted.addListener(this.tabHighlightedHandler);

    // sync scroll positions
    window.addEventListener('scroll', this.handleScroll, false);
    chrome.runtime.sendMessage(
      {
        from: 'sidebar',
        msg: 'REQUEST_SIDEBAR_SCROLL_POSITION',
      },
      (response) => {
        window.scroll(response.scrollPositionX, response.scrollPositionY);
      }
    );
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (
        request.from === 'background' &&
        request.msg === 'UPDATE_SIDEBAR_SCROLL_POSITION'
      ) {
        window.scroll(request.scrollPositionX, request.scrollPositionY);
      }
    });
  }

  componentWillUnmount() {
    chrome.tabs.onCreated.removeListener(this.tabCreatedHandler);
    chrome.tabs.onRemoved.removeListener(this.tabRemovedHandler);
    chrome.tabs.onUpdated.removeListener(this.tabUpdatedHandler);
    chrome.tabs.onMoved.removeListener(this.tabMovedHandler);
    chrome.tabs.onActivated.removeListener(this.tabActivatedHandler);
    chrome.tabs.onHighlighted.removeListener(this.tabHighlightedHandler);

    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = (event) => {
    // https://gomakethings.com/detecting-when-a-visitor-has-stopped-scrolling-with-vanilla-javascript/
    // Clear our timeout throughout the scroll
    window.clearTimeout(this.isScrolling);

    // Set a timeout to run after scrolling ends
    this.isScrolling = setTimeout(function() {
      chrome.runtime.sendMessage({
        from: 'sidebar',
        msg: 'SIDEBAR_SCROLL_POSITION_CHANGED',
        scrollPositionX: window.pageXOffset,
        scrollPositionY: window.pageYOffset,
      });
    }, 66);
  };

  updateTabsDictWithTab = (tab, favicon = getFavicon('chrome://newtab/')) => {
    let tabsDict = { ...this.state.tabsDict };
    tabsDict[tab.id] = {
      faviconUrl: favicon,
      // id: tab.id,
      title: tab.title,
      url: tab.url,
    };
    this.setState({ tabsDict });
  };

  updateTabOrders = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      let tabOrders = [];
      tabs.forEach((tab) => {
        let tabObj = {
          id: tab.id,
          index: tab.index,
          active: tab.active,
        };
        tabOrders.push(tabObj);
        if (tab.active) {
          this.setState({ activeTab: tabObj });
        }
      });
      tabOrders = sortBy(tabOrders, ['index']);
      this.setState({ tabOrders });
    });
  };

  handleTabCreated = (tab) => {
    this.updateTabsDictWithTab(tab);
    this.updateTabOrders();
  };

  handleTabUpdated = (tabId, changes, tab) => {
    if (changes.status === 'complete' || changes.title) {
      this.updateTabsDictWithTab(tab, getFavicon(tab.url));
      if (changes.status === 'complete') {
        setTimeout(() => {
          // make the 'chrome://favicon/' API more reliable
          this.updateTabsDictWithTab(tab, getFavicon(tab.url));
        }, 5000);
      }
    }
  };

  handleTabRemoved = (tabId) => {
    this.setState((prevState) => {
      let tabsDict = { ...prevState.tabsDict };
      delete tabsDict[tabId];
      return {
        tabsDict,
      };
    });

    this.updateTabOrders();
  };

  handleTabMoved = (tabId) => {
    this.updateTabOrders();
  };

  handleTabActivated = (activeInfo) => {
    this.updateTabOrders();
  };

  handleTabHighlighted = (highlightInfo) => {};

  moveTab = (dragIndex, hoverIndex) => {
    const dragTab = this.state.tabOrders[dragIndex];
    this.setState({
      tabOrders: update(this.state.tabOrders, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragTab]],
      }),
    });
  };

  render() {
    const { tabOrders, activeTab, tabsDict } = this.state;

    return (
      <div className="SidebarContainer">
        <Title />
        <TabsList
          tabOrders={tabOrders}
          activeTab={activeTab}
          tabsDict={tabsDict}
          moveTab={this.moveTab}
        />
      </div>
    );
  }
}

export default Sidebar;
