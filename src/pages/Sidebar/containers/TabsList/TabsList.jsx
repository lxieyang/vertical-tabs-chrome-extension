import React from 'react';

import { MdAdd } from 'react-icons/md';

import Tab from './Tab/Tab';

import './TabsList.css';

const TabsList = ({ tabOrders, activeTab, tabsDict, moveTab }) => {
  const openNewTabClickedHandler = (e) => {
    chrome.tabs.create({});
  };

  const tabOrdersCopy = [];
  tabOrders.forEach((tabOrder) => {
    if (tabsDict[tabOrder.id] !== undefined) {
      const { id, index, active } = tabOrder;
      const { faviconUrl, title, url } = tabsDict[tabOrder.id];
      tabOrdersCopy.push({
        id,
        index,
        active,
        faviconUrl,
        title,
        url,
      });
    }
  });

  return (
    <div>
      <ul style={{ margin: 0, padding: '48px 0px 0px 0px' }}>
        {tabOrdersCopy.map((tabOrder, idx) => {
          if (tabsDict[tabOrder.id] === undefined) {
            return null;
          }

          // let tab = { ...tabsDict[tabOrder.id] };
          return (
            <Tab
              key={tabOrder.id}
              idx={idx}
              id={tabOrder.id}
              index={tabOrder.index}
              active={tabOrder.active}
              faviconUrl={tabOrder.faviconUrl}
              title={tabOrder.title}
              url={tabOrder.url}
              activeTab={activeTab}
              moveTab={moveTab}
            />
          );
        })}

        <li className="NewTabButtonContainer" title="Open a new tab">
          <div
            className="NewTabButton"
            onClick={(e) => openNewTabClickedHandler(e)}
          >
            <MdAdd size={'22px'} />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TabsList;
