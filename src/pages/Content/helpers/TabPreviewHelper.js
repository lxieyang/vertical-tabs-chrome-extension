import React from 'react';
import ReactDOM from 'react-dom';
import TabPreviewFrame from '../modules/tabPreviewFrame/tabPreviewFrame';
import { sidebarRoot } from './SidebarHelper';

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
  if (msg === 'PREVIEW_TAB_ON') {
    const { title, url, muted, audible, faviconUrl, tabItemY, isDark } =
      payload;
    // console.log(title, url, faviconUrl, tabItemY, isDark);

    if (unmountTabPreviewFrameTimeout) {
      clearTimeout(unmountTabPreviewFrameTimeout);
    }

    try {
      ReactDOM.render(
        <TabPreviewFrame
          title={title}
          url={url}
          muted={muted}
          audible={audible}
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
