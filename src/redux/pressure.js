import { random } from "../utils";
import axios from "axios";

import { addAlarm } from "./alarm";

export const FETCH_PRESSURE_BEGIN = "FETCH_PRESSURE_BEGIN";
export const FETCH_PRESSURE_SUCCESS = "FETCH_PRESSURE_SUCCESS";
export const FETCH_PRESSURE_FAILURE = "FETCH_PRESSURE_FAILURE";

export const FETCH_PRESSURE_LAST_BEGIN = "FETCH_PRESSURE_LAST_BEGIN";
export const FETCH_PRESSURE_LAST_SUCCESS = "FETCH_PRESSURE_LAST_SUCCESS";
export const FETCH_PRESSURE_LAST_FAILURE = "FETCH_PRESSURE_LAST_FAILURE";

var config = {
  headers: {
    Accept: "application/json"
  }
};

const FAKE = false;

function realGetLast() {
  return axios.get(window.APP_HOST + "/api/pressure/last", config);
}

function fakeGetLast() {
  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        resolve({
          data: {
            id: random(),
            value: random()
          }
        }),
      1000
    );
  });
}

function getLast() {
  return FAKE ? fakeGetLast() : realGetLast();
}

function fakeGetAll() {
  return new Promise(resolve => {
    setTimeout(
      () =>
        resolve({
          data: [
            {
              id: 0,
              value: 1016
            },
            {
              id: 1,
              value: 1016
            },
            {
              id: 2,
              value: 1018
            },
            {
              id: 3,
              value: 1020
            },
            {
              id: 4,
              value: 1021
            },
            {
              id: 5,
              value: 1021
            }
          ]
        }),
      1000
    );
  });
}

function realGetAll() {
  return axios.get(window.APP_HOST + "/api/pressure", config);
}

function getAll() {
  return FAKE ? fakeGetAll() : realGetAll();
}

const handleAddAlarm = (level, value) =>
  addAlarm({
    name: "PRESSURE",
    value: value,
    level: level
  });

export function fetchLastItem() {
  return dispatch => {
    dispatch(fetchPressureLastBegin());
    return getLast()
      .then(({ data }) => {
        if (data.value >= 1100) {
          dispatch(handleAddAlarm("HiHi", data.value));
        } else if (data.value >= 1050) {
          dispatch(handleAddAlarm("Hi", data.value));
        } else if (data.value <= 950) {
          dispatch(handleAddAlarm("LoLo", data.value));
        } else if (data.value <= 1000) {
          dispatch(handleAddAlarm("Lo", data.value));
        }
        dispatch(fetchPressureLastSuccess(data));
        return data;
      })
      .catch(error =>
        dispatch(fetchPressureLastFailure("Error fetch PRESSURE"))
      );
  };
}

export function fetchItems() {
  return dispatch => {
    dispatch(fetchPressureBegin());
    return getAll()
      .then(json => {
        dispatch(fetchPressureSuccess(json.data));
        return json.data;
      })
      .catch(error => dispatch(fetchPressureFailure("Error fetch PRESSURE")));
  };
}

export const fetchPressureBegin = () => ({
  type: FETCH_PRESSURE_BEGIN
});

export const fetchPressureSuccess = data => ({
  type: FETCH_PRESSURE_SUCCESS,
  payload: { data }
});

export const fetchPressureFailure = error => ({
  type: FETCH_PRESSURE_FAILURE,
  payload: { error }
});

export const fetchPressureLastBegin = () => ({
  type: FETCH_PRESSURE_LAST_BEGIN
});

export const fetchPressureLastSuccess = data => ({
  type: FETCH_PRESSURE_LAST_SUCCESS,
  payload: { data }
});

export const fetchPressureLastFailure = error => ({
  type: FETCH_PRESSURE_LAST_FAILURE,
  payload: { error }
});

const initialState = {
  items: [],
  loading: false,
  loadingLast: false,
  error: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRESSURE_BEGIN:
      return {
        ...state,
        loading: true
      };
    case FETCH_PRESSURE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.data
      };
    case FETCH_PRESSURE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    case FETCH_PRESSURE_LAST_BEGIN:
      return {
        ...state,
        loadingLast: true
      };
    case FETCH_PRESSURE_LAST_SUCCESS:
    if (!action.payload.data) {
      return {
        ...state,
        error: null,
        loadingLast: false
      };
    }
      const found = state.items.find(
        item => item.id === action.payload.data.id
      );
      return {
        ...state,
        error: null,
        loadingLast: false,
        items: found ? state.items : [...state.items, action.payload.data]
      };
    case FETCH_PRESSURE_LAST_FAILURE:
      return {
        ...state,
        loadingLast: false,
        error: action.payload.error
      };
    default:
      return state;
  }
}
