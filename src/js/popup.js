'use strict';
import "../css/popup.css";
import '../img/icon-128.png'
import '../img/icon-34.png'

import Greeting from "./popup/greeting_component.jsx";
import React from "react";
import { render } from "react-dom";

render(
  <Greeting/>,
  window.document.getElementById("app-container")
);
