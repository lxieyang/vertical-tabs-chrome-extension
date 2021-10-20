import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import copy from 'clipboard-copy';
import Frame from './modules/frame/frame';
import TabPreviewFrame from './modules/tabPreviewFrame/tabPreviewFrame';
import UpdateNotice from './modules/UpdateNotice/UpdateNotice';
import { SIDEBAR_CONTAINER_ID } from '../../shared/constants';

let shouldShrinkBody = true;
let sidebarLocation = 'left';
let autoShowHide = false;
let autoShowHideDelay = 500;
const toggleButtonLocation = 'bottom';
let sidebarWidth = 280;

let updateNoticeRoot = document.createElement('div');
document.body.appendChild(updateNoticeRoot);
updateNoticeRoot.setAttribute('id', 'vt-update-notice');
localStorage.removeItem('vt-update-notice-dismissed');

document.addEventListener('visibilitychange', (info) => {
  // console.log(info);
  // console.log(document.hidden);
  try {
    chrome.runtime.sendMessage({ msg: 'GET_VERSION_NUMBER' }, (response) => {
      // console.log(response);
    });
  } catch (err) {
    if (err.toString().indexOf('Extension context invalidated') !== -1) {
      if (!document.hidden) {
        console.log('should refresh page');
        ReactDOM.render(<UpdateNotice />, updateNoticeRoot);
      } else {
        ReactDOM.unmountComponentAtNode(updateNoticeRoot);
      }
    }
  }
});

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

function fixShrinkBody(isOpen) {
  if (isOpen) {
    if (shouldShrinkBody) {
      if (sidebarLocation === 'left') {
        document.body.style.marginLeft = `${sidebarWidth + 10}px`;
      } else {
        document.body.style.marginRight = `${sidebarWidth + 10}px`;
      }
    } else {
      if (sidebarLocation === 'left') {
        document.body.style.marginLeft = '0px';
      } else {
        document.body.style.marginRight = '0px';
      }
    }
  } else {
    document.body.style.marginLeft = '0px';
    document.body.style.marginRight = '0px';
  }
}

let sidebarRoot = document.createElement('div');
document.body.appendChild(sidebarRoot);
sidebarRoot.setAttribute('id', 'vt-sidebar-root');

function mountSidebar() {
  // console.log('Mounting sidebar on the', sidebarLocation);
  const App = (
    <Frame
      url={chrome.runtime.getURL('sidebar.html')}
      shrinkBody={shrinkBody}
      fixShrinkBody={fixShrinkBody}
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

chrome.storage.sync.get(['shouldShrinkBody'], (result) => {
  if (result.shouldShrinkBody !== undefined) {
    shouldShrinkBody = result.shouldShrinkBody === true;
  }
});

chrome.storage.sync.get(['sidebarOnLeft'], (result) => {
  if (result.sidebarOnLeft !== undefined) {
    sidebarLocation = result.sidebarOnLeft === true ? 'left' : 'right';
  }
  mountSidebar();
});

chrome.storage.sync.get(['autoShowHide'], (result) => {
  if (result.autoShowHide !== undefined) {
    autoShowHide = result.autoShowHide === true;
    if (autoShowHide) {
      mountAutoShowHideListener();
    }
  } else {
    unmountAutoShowHideListener();
  }
});

chrome.storage.sync.get(['autoShowHideDelay'], (result) => {
  if (result.autoShowHideDelay !== undefined) {
    autoShowHideDelay = result.autoShowHideDelay;
  }
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

/**
 * Auto Show Hide
 */
let mouseLeftSidebarTimer = null;
const openSidebarUponMouseOverWindowEdge = () => {
  chrome.runtime.sendMessage(
    {
      from: 'content',
      msg: 'REQUEST_SIDEBAR_STATUS',
    },
    (response) => {
      let sidebarOpen = response.sidebarOpen;
      if (sidebarOpen === false) {
        // open sidebar on this page with timer
        console.log('should open sidebar');
        if (Frame.isReady()) {
          isToggledOpenGloballyFromBackground = false;
          Frame.toggle(true);
        }
      }
    }
  );
};

const mouseEnteredSidebarHandler = (event) => {
  if (isToggledOpenGloballyFromBackground === true) {
    return;
  }
  // console.log('mouse entered');
  clearTimeout(mouseLeftSidebarTimer);
};

const mouseLeftSidebarHandler = (event) => {
  if (isToggledOpenGloballyFromBackground === true) {
    return;
  }
  // console.log('mouse left');
  mouseLeftSidebarTimer = setTimeout(() => {
    if (Frame.isReady()) {
      Frame.toggle(false);
    }
  }, autoShowHideDelay);
};

const focusOffSidebarHandler = (event) => {
  if (isToggledOpenGloballyFromBackground === true) {
    return;
  }
  // console.log('mouse left');
  if (Frame.isReady()) {
    Frame.toggle(false);
  }
  clearTimeout(mouseLeftSidebarTimer);
};

const visibilityChangeOnSidebarHandler = (info) => {
  if (isToggledOpenGloballyFromBackground === true) {
    return;
  }
  if (document.hidden) {
    // console.log('mouse left');
    if (Frame.isReady()) {
      Frame.toggle(false);
    }
    clearTimeout(mouseLeftSidebarTimer);
  }
};

let isMouseWithinEdgeDelta = false;
let isToggledOpenGloballyFromBackground = false;
const openSidebarUponMouseOverWindowEdgeEventHandler = (event) => {
  if (isToggledOpenGloballyFromBackground === true) {
    return;
  }
  const delta = 5;
  if (sidebarLocation === 'left' && event.clientX < delta) {
    if (!isMouseWithinEdgeDelta) {
      console.log('reached left side');
      isMouseWithinEdgeDelta = true;
      openSidebarUponMouseOverWindowEdge();
    }
  } else if (
    sidebarLocation === 'right' &&
    event.clientX > $(document).width() - delta
  ) {
    if (!isMouseWithinEdgeDelta) {
      console.log('reached right side');
      isMouseWithinEdgeDelta = true;
      openSidebarUponMouseOverWindowEdge();
    }
  } else {
    isMouseWithinEdgeDelta = false;
  }
};

const mountAutoShowHideListener = () => {
  $(document).on('mousemove', openSidebarUponMouseOverWindowEdgeEventHandler);
  $(document).on(
    'mouseenter',
    `#${SIDEBAR_CONTAINER_ID}`,
    mouseEnteredSidebarHandler
  );
  $(document).on(
    'mouseleave',
    `#${SIDEBAR_CONTAINER_ID}`,
    mouseLeftSidebarHandler
  );

  $(document).on('blur', `#${SIDEBAR_CONTAINER_ID}`, focusOffSidebarHandler);
  document.addEventListener(
    'visibilitychange',
    visibilityChangeOnSidebarHandler
  );
};

const unmountAutoShowHideListener = () => {
  $(document).off('mousemove', openSidebarUponMouseOverWindowEdgeEventHandler);
  $(document).off(
    'mouseenter',
    `#${SIDEBAR_CONTAINER_ID}`,
    mouseEnteredSidebarHandler
  );
  $(document).off(
    'mouseleave',
    `#${SIDEBAR_CONTAINER_ID}`,
    mouseLeftSidebarHandler
  );
  $(document).off('blur', `#${SIDEBAR_CONTAINER_ID}`, focusOffSidebarHandler);
  document.removeEventListener(
    'visibilitychange',
    visibilityChangeOnSidebarHandler
  );
};

/**
 * Chrome runtime event listener
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === 'background' && request.msg === 'TOGGLE_SIDEBAR') {
    if (Frame.isReady()) {
      isToggledOpenGloballyFromBackground =
        request.toStatus === true ? true : false;

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
  } else if (
    request.from === 'background' &&
    request.msg === 'UPDATE_SHOULD_SHRINK_BODY_STATUS'
  ) {
    const { toStatus } = request;
    shouldShrinkBody = toStatus;
    Frame.shrinkBody();
  } else if (
    request.from === 'background' &&
    request.msg === 'UPDATE_AUTO_SHOW_HIDE_STATUS'
  ) {
    const { toStatus } = request;
    autoShowHide = toStatus;
    if (autoShowHide) {
      mountAutoShowHideListener();
    } else {
      unmountAutoShowHideListener();
    }
  } else if (
    request.from === 'background' &&
    request.msg === 'UPDATE_AUTO_SHOW_HIDE_DELAY_STATUS'
  ) {
    const { toStatus } = request;
    autoShowHideDelay = toStatus;
  }
});

/**
 * Window event listener
 */
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
let tabPreviewFrameRoot = document.createElement('div');
document.body.appendChild(tabPreviewFrameRoot);
tabPreviewFrameRoot.setAttribute('id', 'tab-preview-frame-root');

tabPreviewFrameRoot.style.transition = 'all ease-in-out 0.1s';
tabPreviewFrameRoot.style.position = 'fixed';

const hideTabPreviewFramePosition = () => {
  tabPreviewFrameRoot.style.zIndex = '-100';
  tabPreviewFrameRoot.style.visibility = 'hidden';
};

const resetTabPreviewFramePosition = () => {
  tabPreviewFrameRoot.style.top = null;
  tabPreviewFrameRoot.style.left = null;
  tabPreviewFrameRoot.style.bottom = null;
  tabPreviewFrameRoot.style.right = null;
};

hideTabPreviewFramePosition();
resetTabPreviewFramePosition();

let unmountTabPreviewFrameTimeout;

window.addEventListener('message', (event) => {
  const { msg, payload } = event.data;
  if (msg === 'COPY_URL') {
    copy(payload.url);
  } else if (msg === 'PREVIEW_TAB_ON') {
    const { title, url, faviconUrl, tabItemY, isDark } = payload;
    // console.log(title, url, faviconUrl, tabItemY, isDark);

    if (unmountTabPreviewFrameTimeout) {
      clearTimeout(unmountTabPreviewFrameTimeout);
    }

    try {
      ReactDOM.render(
        <TabPreviewFrame
          title={title}
          url={url}
          faviconUrl={faviconUrl}
          isDark={isDark}
        />,
        tabPreviewFrameRoot
      );
      tabPreviewFrameRoot.style.zIndex = '999999999';
      tabPreviewFrameRoot.style.visibility = 'visible';

      const sidebarIframe = sidebarRoot.querySelector('iframe');
      const {
        left: iframeLeft,
        width: iframeWidth,
        right: iframeRight,
      } = sidebarIframe.getBoundingClientRect();

      let top = tabItemY;
      let previewFrameHeight = tabPreviewFrameRoot
        .querySelector('.TabPreviewContainer')
        .getBoundingClientRect().height;
      if (top + previewFrameHeight >= window.innerHeight) {
        top = window.innerHeight - previewFrameHeight - 5;
      }
      tabPreviewFrameRoot.style.top = `${Math.floor(top)}px`;

      const isIframeOnLeft = iframeLeft === 0;
      if (isIframeOnLeft) {
        tabPreviewFrameRoot.style.left = `${Math.floor(iframeRight) + 3}px`;
      } else {
        tabPreviewFrameRoot.style.right = `${Math.floor(iframeWidth) + 3}px`;
      }
    } catch (err) {
      hideTabPreviewFramePosition();
      ReactDOM.unmountComponentAtNode(tabPreviewFrameRoot);
      resetTabPreviewFramePosition();
    }
  } else if (msg === 'PREVIEW_TAB_OFF') {
    hideTabPreviewFramePosition();
    unmountTabPreviewFrameTimeout = setTimeout(() => {
      ReactDOM.unmountComponentAtNode(tabPreviewFrameRoot);
      resetTabPreviewFramePosition();
    }, 500);
  }
});
