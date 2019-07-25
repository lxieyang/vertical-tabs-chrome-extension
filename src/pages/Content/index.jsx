import React from 'react';
import ReactDOM from 'react-dom';
import Frame from './modules/frame';

let shouldShrinkBody = false;
let sidebarRoot = document.createElement('div');
document.body.appendChild(sidebarRoot);
sidebarRoot.setAttribute('id', 'vt-sidebar-root');

function shrinkBody(isOpen) {
  if (shouldShrinkBody) {
    if (isOpen) {
      document.body.style.marginRight = '410px';
    } else {
      document.body.style.marginRight = '0px';
    }
  }
}

function mountSidebar() {
  console.log(chrome.extension.getURL('sidebar.html'));
  const App = (
    <Frame
      url={chrome.extension.getURL('sidebar.html')}
      shrinkBody={shrinkBody}
      viewportWidth={window.innerWidth}
      sidebarLocation={'left'}
      toggleButtonLocation={'bottom'}
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

setTimeout(() => {
  console.log(Frame.isReady());
  Frame.toggle();
}, 1000);
