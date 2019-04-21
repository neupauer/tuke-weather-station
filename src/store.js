import { applyMiddleware, createStore, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import humidity from "./redux/humidity";
import temperature from "./redux/temperature";
import pressure from "./redux/pressure";
import alarm from "./redux/alarm";
import auth from "./redux/auth";

const rootReducer = combineReducers({
  humidity,
  temperature,
  pressure,
  alarm,
  auth
});

export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
