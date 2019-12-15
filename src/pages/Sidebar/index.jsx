import React, { useState } from 'react';
import { render } from 'react-dom';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Media from 'react-media';

import Sidebar from './Sidebar';
import './index.css';

import DarkModeContext from './context/dark-mode-context';

const App = () => {
  const [isDark, setIsDark] = useState(false);

  const setDarkStatus = (dark) => {
    setIsDark(dark);
    if (dark) {
      document.body.classList.add('Dark');
    } else {
      document.body.classList.remove('Dark');
    }
  };

  return (
    <React.Fragment>
      <DarkModeContext.Provider value={{ isDark, setDarkStatus }}>
        <Media
          query="(prefers-color-scheme: dark)"
          onChange={(dark) => {
            setDarkStatus(dark);
          }}
        />
        <DndProvider backend={HTML5Backend}>
          <Sidebar />
        </DndProvider>
      </DarkModeContext.Provider>
    </React.Fragment>
  );
};

render(<App />, window.document.querySelector('#app-container'));
