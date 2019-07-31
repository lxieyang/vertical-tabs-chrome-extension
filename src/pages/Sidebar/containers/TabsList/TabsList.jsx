import React, { Component } from 'react';
import ReactHoverObserver from 'react-hover-observer';
import LinesEllipsis from 'react-lines-ellipsis';

import { MdClose } from 'react-icons/md';
import { MdRefresh } from 'react-icons/md';
import { MdAdd } from 'react-icons/md';

import './TabsList.css';

class TabsList extends Component {
  setTabAsActive = (tabId) => {
    chrome.tabs.update(tabId, { active: true });
  };

  reloadTabClickedHandler = (e, tabId) => {
    e.stopPropagation();
    chrome.tabs.reload(tabId);
  };

  clostTabClickedHandler = (e, tabId) => {
    e.stopPropagation();
    chrome.tabs.remove(tabId);
  };

  openNewTabClickedHandler = (e) => {
    chrome.tabs.create({});
  };

  render() {
    const { tabOrders, activeTab, tabsDict } = this.props;

    return (
      <div>
        <ul style={{ margin: 0, padding: '48px 0px 0px 0px' }}>
          {tabOrders.map((tabOrder, idx) => {
            if (tabsDict[tabOrder.id] === undefined) {
              return null;
            }

            let tab = tabsDict[tabOrder.id];
            return (
              <ReactHoverObserver key={idx}>
                {({ isHovering }) => (
                  <li
                    className="TabItem"
                    onClick={() => this.setTabAsActive(tab.id)}
                    onMouseOver={() => {
                      if (isHovering) {
                        if (tabOrder.index === activeTab.index) {
                          chrome.tabs.highlight(
                            { tabs: [activeTab.index] },
                            null
                          );
                        } else {
                          chrome.tabs.highlight(
                            { tabs: [activeTab.index, tabOrder.index] },
                            null
                          );
                        }
                      }
                    }}
                  >
                    <div
                      className={[
                        'TabContainerPad',
                        tabOrder.active ? 'TabContainerPadActive' : null,
                        !tabOrder.active && isHovering
                          ? 'TabContainerPadInactiveHovering'
                          : null,
                      ].join(' ')}
                    >
                      <div className={'TabContainerLeftPadInner'}></div>
                    </div>

                    <div
                      className={[
                        'TabContainer',
                        tabOrder.active ? 'ActiveTabContainer' : null,
                        !tabOrder.active && isHovering
                          ? 'InactiveTabContainerHovering'
                          : null,
                      ].join(' ')}
                    >
                      {/* <div className="Ordinal">{tabOrder.index + 1}</div> */}
                      <div className="TabFaviconContainer">
                        <img
                          src={tab.faviconUrl ? tab.faviconUrl : tab.favIconUrl}
                          alt="favicon"
                        />
                      </div>
                      <div className="TabTitleContainer" title={tab.title}>
                        {/* <LinesEllipsis
                          text={tab.title}
                          maxLine="1"
                          ellipsis="..."
                          trimRight
                          basedOn="letters"
                        /> */}
                        {tab.title}
                      </div>

                      <div
                        title="Reload tab"
                        className="ActionButtonContainer"
                        style={{ opacity: isHovering ? 1 : 0 }}
                      >
                        <div
                          className="ActionButton"
                          onClick={(e) =>
                            this.reloadTabClickedHandler(e, tab.id)
                          }
                        >
                          <MdRefresh size={'16px'} />
                        </div>
                      </div>

                      <div className="ActionButtonSpaceBetween"></div>

                      <div title="Close tab" className="ActionButtonContainer">
                        <div
                          className="ActionButton"
                          onClick={(e) =>
                            this.clostTabClickedHandler(e, tab.id)
                          }
                        >
                          <MdClose size={'16px'} />
                        </div>
                      </div>
                    </div>

                    <div
                      className={[
                        'TabContainerPad',
                        tabOrder.active ? 'TabContainerPadActive' : null,
                        !tabOrder.active && isHovering
                          ? 'TabContainerPadInactiveHovering'
                          : null,
                      ].join(' ')}
                    >
                      <div className={'TabContainerRightPadInner'}></div>
                    </div>
                  </li>
                )}
              </ReactHoverObserver>
            );
          })}
          <li className="NewTabButtonContainer" title="Open a new tab">
            <div
              className="NewTabButton"
              onClick={(e) => this.openNewTabClickedHandler(e)}
            >
              <MdAdd size={'22px'} />
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default TabsList;
