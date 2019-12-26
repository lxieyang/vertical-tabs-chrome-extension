import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import '../../assets/img/icon-128-eye.png';
import '../../assets/img/iframe-background.gif';
import './modules/installationHelper';

let sidebarOpen = true; // open -> true  |  close -> false
let sidebarScrollPosition = {
  scrollPositionX: 0,
  scrollPositionY: 0,
};

chrome.storage.local.get(['sidebarOpen'], (result) => {
  if (result.sidebarOpen !== undefined) {
    sidebarOpen = result.sidebarOpen === true;
  }
  changeBrowserIconBadgeWithSidebarOpenStatus(sidebarOpen);
});

const changeBrowserIconBadgeWithSidebarOpenStatus = (status) => {
  if (status) {
    chrome.browserAction.setIcon({
      path: chrome.extension.getURL('icon-128-eye.png'),
    });
  } else {
    chrome.browserAction.setIcon({
      path: chrome.extension.getURL('icon-128.png'),
    });
  }
};

const persistSidebarOpenStatus = (status) => {
  chrome.storage.local.set({
    sidebarOpen: status,
  });
};

/**
 * Sidebar on Left
 */
let sidebarOnLeft = true; // left -> true  |  right -> false

chrome.storage.sync.get(['sidebarOnLeft'], (result) => {
  if (result.sidebarOnLeft !== undefined) {
    sidebarOnLeft = result.sidebarOnLeft === true;
  } else {
    persistSidebarOnLeftStatus(true); // default on left
  }
});

const persistSidebarOnLeftStatus = (status) => {
  chrome.storage.sync.set({
    sidebarOnLeft: status,
  });
};

/**
 * Should Shrink Body
 */
let shouldShrinkBody = true;

chrome.storage.sync.get(['shouldShrinkBody'], (result) => {
  if (result.shouldShrinkBody !== undefined) {
    shouldShrinkBody = result.shouldShrinkBody === true;
  } else {
    persistShouldShrinkBodyStatus(true); // default to shrink body
  }
});

const persistShouldShrinkBodyStatus = (status) => {
  chrome.storage.sync.set({
    shouldShrinkBody: status,
  });
};

/**
 * Display Tab in Full
 */
let displayTabInFull = true;

chrome.storage.sync.get(['displayTabInFull'], (result) => {
  if (result.displayTabInFull !== undefined) {
    displayTabInFull = result.displayTabInFull === true;
  } else {
    persistdisplayTabInFullStatus(true); // default to display tab in full
  }
});

const persistdisplayTabInFullStatus = (status) => {
  chrome.storage.sync.set({
    displayTabInFull: status,
  });
};

/**
 * Dark Mode
 */
let darkMode = 'auto';

chrome.storage.sync.get(['darkMode'], (result) => {
  if (result.darkMode !== undefined) {
    darkMode = result.darkMode;
  } else {
    persistDarkMode('auto'); // default to auto
  }
});

const persistDarkMode = (status) => {
  chrome.storage.sync.set({
    darkMode: status,
  });
};

const toggleSidebar = (toStatus = null) => {
  if (toStatus === null || toStatus === undefined) {
    sidebarOpen = !sidebarOpen;
  } else {
    sidebarOpen = toStatus;
  }
  persistSidebarOpenStatus(sidebarOpen);
  changeBrowserIconBadgeWithSidebarOpenStatus(sidebarOpen);
  let sidebarOpenCopy = sidebarOpen;
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'TOGGLE_SIDEBAR',
          toStatus: sidebarOpenCopy,
        });
      });
    }
  );
};

const updateSidebarWidth = (width) => {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'UPDATE_SIDEBAR_WIDTH',
          width,
        });
      });
    }
  );
};

const updateSidebarScrollPosition = () => {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'UPDATE_SIDEBAR_SCROLL_POSITION',
          scrollPositionX: sidebarScrollPosition.scrollPositionX,
          scrollPositionY: sidebarScrollPosition.scrollPositionY,
        });
      });
    }
  );
};

const updateSidebarOnLeftStatus = (toStatus) => {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'UPDATE_SIDEBAR_ON_LEFT_STATUS',
          toStatus,
        });
      });
    }
  );
};

const updateShouldShrinkBodyStatus = (toStatus) => {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'UPDATE_SHOULD_SHRINK_BODY_STATUS',
          toStatus,
        });
      });
    }
  );
};

const updateDisplayTabInFullStatus = (toStatus) => {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'UPDATE_DISPLAY_TAB_IN_FULL_STATUS',
          toStatus,
        });
      });
    }
  );
};

const updateDarkModeStatus = (toStatus) => {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'UPDATE_DARK_MODE_STATUS',
          toStatus,
        });
      });
    }
  );
};

// chrome.browserAction.setPopup({
//   popup: chrome.extension.getURL('sidebar.html'),
// });

// setTimeout(() => {
//   console.log('reset popup');
//   chrome.browserAction.setPopup({
//     popup: '',
//   });
// }, 3000);

chrome.browserAction.onClicked.addListener((senderTab) => {
  console.log('browser icon clicked');
  toggleSidebar();
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === '_execute_browser_action') {
    toggleSidebar();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (
    request.from === 'sidebar' &&
    request.msg === 'SIDEBAR_SCROLL_POSITION_CHANGED'
  ) {
    sidebarScrollPosition = {
      scrollPositionX: request.scrollPositionX,
      scrollPositionY: request.scrollPositionY,
    };
    updateSidebarScrollPosition();
  } else if (
    request.from === 'sidebar' &&
    request.msg === 'REQUEST_SIDEBAR_SCROLL_POSITION'
  ) {
    sendResponse({
      scrollPositionX: sidebarScrollPosition.scrollPositionX,
      scrollPositionY: sidebarScrollPosition.scrollPositionY,
    });
  } else if (
    request.from === 'content' &&
    request.msg === 'REQUEST_SIDEBAR_STATUS'
  ) {
    sendResponse({
      sidebarOpen,
    });
  } else if (
    request.from === 'content' &&
    request.msg === 'REQUEST_TOGGLE_SIDEBAR'
  ) {
    toggleSidebar(request.toStatus);
  } else if (request.from === 'content' && request.msg === 'WIDTH_CHANGED') {
    updateSidebarWidth(request.width);
  } else if (
    request.from === 'settings' &&
    request.msg === 'USER_CHANGE_SIDEBAR_LOCATION'
  ) {
    const { toStatus } = request;
    sidebarOnLeft = toStatus === 'left';
    persistSidebarOnLeftStatus(sidebarOnLeft);
    updateSidebarOnLeftStatus(sidebarOnLeft);
  } else if (
    request.from === 'settings' &&
    request.msg === 'USER_CHANGE_SIDEBAR_SHOULD_SHRINK_BODY'
  ) {
    const { toStatus } = request;
    shouldShrinkBody = toStatus;
    persistShouldShrinkBodyStatus(shouldShrinkBody);
    updateShouldShrinkBodyStatus(shouldShrinkBody);
  } else if (
    request.from === 'settings' &&
    request.msg === 'USER_CHANGE_DISPLAY_TAB_TITLE_IN_FULL'
  ) {
    const { toStatus } = request;
    displayTabInFull = toStatus;
    persistdisplayTabInFullStatus(displayTabInFull);
    updateDisplayTabInFullStatus(displayTabInFull);
  } else if (
    request.from === 'settings' &&
    request.msg === 'USER_CHANGE_DARK_MODE'
  ) {
    const { toStatus } = request;
    darkMode = toStatus;
    persistDarkMode(darkMode);
    updateDarkModeStatus(darkMode);
  }
});
