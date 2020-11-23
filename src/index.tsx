import React from "react";
import { render } from "react-dom";

import App from "./App";
import { hotjar } from 'react-hotjar';
const rootElement = document.getElementById("root");
hotjar.initialize(2116175,6);
render(<App />, rootElement);
