import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store";

window.APP_HOST = "http://localhost:8080";
// window.APP_HOST = "http://192.168.0.100";

const rootElement = document.getElementById("app");
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

let t;

const logout = () => {
  alert('You\'ve been logged out due to inactivity');
  location = location;
};

const reset = () => {
  clearTimeout(t);
  t = setTimeout(logout, 1000 * 60 * 5);
};

window.addEventListener('mousedown', reset);
window.addEventListener('click', reset);
window.addEventListener('keypress', reset);

reset();