let isFirstInstall = false;
let currentVersion = chrome.runtime.getManifest().version;

localStorage.setItem('vt-version', chrome.runtime.getManifest().version);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === 'GET_VERSION_NUMBER') {
    sendResponse({ version: chrome.runtime.getManifest().version });
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('This is a first install!');
    isFirstInstall = true;
  } else if (details.reason === 'update') {
    const thisVersion = chrome.runtime.getManifest().version;
    const prevVersion = details.previousVersion;
    console.log(thisVersion, prevVersion);
  }
});

let shouldShowTips = false;

chrome.storage.local.get(['shouldShowTips'], (result) => {
  if (result.shouldShowTips !== undefined) {
    shouldShowTips = false;
    persistShouldShowTipsStatus(false);
  } else {
    shouldShowTips = true;
    persistShouldShowTipsStatus(true);
  }

  console.log('shouldShowTips:', shouldShowTips);
});

chrome.browserAction.setTitle({
  title: `Vertical Tabs: Use Command + E (Ctrl + E on PC) to toggle the sidebar`,
});

const persistShouldShowTipsStatus = (toStatus) => {
  chrome.storage.local.set({
    shouldShowTips: toStatus,
  });
};
