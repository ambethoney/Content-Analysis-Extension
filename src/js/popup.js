import '../css/popup.css';
import '../img/icon-128.png'
import '../img/icon-34.png'

import Popup from './popup/Popup.jsx';
import React from 'react';
import { render } from 'react-dom';

render(
  <Popup/>,
  window.document.getElementById('app-container')
);
