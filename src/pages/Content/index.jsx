import React from 'react';
import ReactDOM from 'react-dom';
import Frame from './modules/frame/frame';

const shouldShrinkBody = true;
let sidebarLocation = 'left';
const toggleButtonLocation = 'bottom';
let sidebarWidth = 280;

const setSidebarWidth = (width) => {
  sidebarWidth = width;
};

chrome.storage.sync.get(['vt-sidebar-width'], (result) => {
  let widthObj = result['vt-sidebar-width'];
  if (widthObj !== undefined) {
    sidebarWidth = JSON.parse(widthObj).width;
  }
});

document.body.style.transition = 'margin .25s cubic-bezier(0, 0, 0.3, 1)';

function shrinkBody(isOpen) {
  if (shouldShrinkBody) {
    if (sidebarLocation === 'right') {
      if (isOpen) {
        document.body.style.marginRight = `${sidebarWidth + 10}px`;
      } else {
        document.body.style.marginRight = '0px';
      }
    } else if (sidebarLocation === 'left') {
      if (isOpen) {
        document.body.style.marginLeft = `${sidebarWidth + 10}px`;
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
  // console.log('Mounting sidebar on the', sidebarLocation);
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
    document.body.style.marginLeft = '0px';
    document.body.style.marginRight = '0px';
    ReactDOM.unmountComponentAtNode(sidebarRoot);
  } catch (e) {
    console.log(e);
  }
}

chrome.storage.sync.get(['sidebarOnLeft'], (result) => {
  if (result.sidebarOnLeft !== undefined) {
    sidebarLocation = result.sidebarOnLeft === true ? 'left' : 'right';
  }
  mountSidebar();
});

const checkSidebarStatus = () => {
  chrome.runtime.sendMessage(
    {
      from: 'content',
      msg: 'REQUEST_SIDEBAR_STATUS',
    },
    (response) => {
      let sidebarOpen = response.sidebarOpen;
      if (Frame.isReady()) {
        Frame.toggle(sidebarOpen);
      }
    }
  );
};

checkSidebarStatus();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === 'background' && request.msg === 'TOGGLE_SIDEBAR') {
    if (Frame.isReady()) {
      Frame.toggle(request.toStatus);
    }
  } else if (
    request.from === 'background' &&
    request.msg === 'UPDATE_SIDEBAR_ON_LEFT_STATUS'
  ) {
    const { toStatus } = request;
    sidebarLocation = toStatus === true ? 'left' : 'right';
    unmountSidebar();
    mountSidebar();
    checkSidebarStatus();
  }
});

window.addEventListener('keydown', (event) => {
  if (
    (event.ctrlKey && event.key === '`') ||
    (event.ctrlKey && event.key === 'Escape') ||
    (event.metaKey && event.key === 'Escape') ||
    (event.altKey && event.key === '`') ||
    (event.altKey && event.key === 'Escape')
  ) {
    chrome.runtime.sendMessage({
      from: 'content',
      msg: 'REQUEST_TOGGLE_SIDEBAR',
    });
  }
});
