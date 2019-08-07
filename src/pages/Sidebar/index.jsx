import React from 'react';
import { render } from 'react-dom';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Sidebar from './Sidebar';
import './index.css';

const App = () => (
  <DndProvider backend={HTML5Backend}>
    <Sidebar />
  </DndProvider>
);

render(<App />, window.document.querySelector('#app-container'));
