import React from 'react';
import { render } from 'react-dom';

import Sidebar from './Sidebar';
import './index.css';

render(<Sidebar />, window.document.querySelector('#app-container'));
