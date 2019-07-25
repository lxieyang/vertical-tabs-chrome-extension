import React from 'react';
import ReactDOM from 'react-dom';
import Frame from './modules/frame/frame';

const shouldShrinkBody = true;
const sidebarLocation = 'right';
const toggleButtonLocation = 'bottom';
let sidebarWidth = 400;

const setSidebarWidth = (width) => {
  sidebarWidth = width;
};

chrome.storage.sync.get(['vt-sidebar-width'], (result) => {
  let widthObj = result['vt-sidebar-width'];
  if (widthObj !== undefined) {
    sidebarWidth = JSON.parse(widthObj).width;
  }
});

function shrinkBody(isOpen) {
  if (shouldShrinkBody) {
    if (sidebarLocation === 'right') {
      if (isOpen) {
        document.body.style.marginRight = `${sidebarWidth}px`;
      } else {
        document.body.style.marginRight = '0px';
      }
    } else if (sidebarLocation === 'left') {
      if (isOpen) {
        document.body.style.marginLeft = `${sidebarWidth}px`;
      } else {
        document.body.style.marginLeft = '0px';
      }
    }
  }
}

let sidebarRoot = document.createElement('div');
document.body.appendChild(sidebarRoot);
sidebarRoot.setAttribute('id', 'vt-sidebar-root');

function mountSidebar() {
  const App = (
    <Frame
      url={chrome.extension.getURL('sidebar.html')}
      shrinkBody={shrinkBody}
      viewportWidth={window.innerWidth}
      sidebarLocation={sidebarLocation}
      toggleButtonLocation={toggleButtonLocation}
      setSidebarWidth={setSidebarWidth}
    />
  );
  ReactDOM.render(App, sidebarRoot);
}

function unmountSidebar() {
  try {
    document.body.style.marginRight = '0px';
    ReactDOM.unmountComponentAtNode(sidebarRoot);
  } catch (e) {
    console.log(e);
  }
}

mountSidebar();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === 'background' && request.msg === 'TOGGLE_SIDEBAR') {
    if (Frame.isReady()) {
      Frame.toggle();
    }
  }
});
