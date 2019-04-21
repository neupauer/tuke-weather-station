import { random } from "../utils";
import axios from "axios";

import { addAlarm } from "./alarm";

export const FETCH_HUMIDITY_BEGIN = "FETCH_HUMIDITY_BEGIN";
export const FETCH_HUMIDITY_SUCCESS = "FETCH_HUMIDITY_SUCCESS";
export const FETCH_HUMIDITY_FAILURE = "FETCH_HUMIDITY_FAILURE";

export const FETCH_HUMIDITY_LAST_BEGIN = "FETCH_HUMIDITY_LAST_BEGIN";
export const FETCH_HUMIDITY_LAST_SUCCESS = "FETCH_HUMIDITY_LAST_SUCCESS";
export const FETCH_HUMIDITY_LAST_FAILURE = "FETCH_HUMIDITY_LAST_FAILURE";

var config = {
  headers: {
    Accept: "application/json"
  }
};

const FAKE = false;

function realGetLast() {
  return axios.get(window.APP_HOST + "/api/humidity/last", config);
}

function fakeGetLast() {
  return new Promise(resolve => {
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
              value: 59
            },
            {
              id: 1,
              value: 60
            },
            {
              id: 2,
              value: 59
            },
            {
              id: 3,
              value: 59
            },
            {
              id: 4,
              value: 56
            },
            {
              id: 5,
              value: 55
            },
            {
              id: 6,
              value: 52
            }
          ]
        }),
      1000
    );
  });
}

function realGetAll() {
  return axios.get(window.APP_HOST + "/api/humidity", config);
}

function getAll() {
  return FAKE ? fakeGetAll() : realGetAll();
}

const handleAddAlarm = (level, data) =>
  addAlarm({
    name: "HUMIDITY",
    valueId: data.id,
    value: data.value,
    level: level
  });

export function fetchLastItem() {
  return dispatch => {
    dispatch(fetchHumidityLastBegin());
    return getLast()
      .then(({ data }) => {
        if (data.value >= 95) {
          dispatch(handleAddAlarm("HiHi", data));
        } else if (data.value >= 75) {
          dispatch(handleAddAlarm("Hi", data));
        } else if (data.value <= 5) {
          dispatch(handleAddAlarm("LoLo", data));
        } else if (data.value <= 25) {
          dispatch(handleAddAlarm("Lo", data));
        }
        dispatch(fetchHumidityLastSuccess(data));
        return data;
      })
      .catch(error =>
        dispatch(fetchHumidityLastFailure("Error fetch HUMIDITY"))
      );
  };
}

export function fetchItems() {
  return dispatch => {
    dispatch(fetchHumidityBegin());
    return getAll()
      .then(json => {
        dispatch(fetchHumiditySuccess(json.data));
        return json.data;
      })
      .catch(error => dispatch(fetchHumidityFailure("Error fetch HUMIDITY")));
  };
}

export const fetchHumidityBegin = () => ({
  type: FETCH_HUMIDITY_BEGIN
});

export const fetchHumiditySuccess = data => ({
  type: FETCH_HUMIDITY_SUCCESS,
  payload: { data }
});

export const fetchHumidityFailure = error => ({
  type: FETCH_HUMIDITY_FAILURE,
  payload: { error }
});

export const fetchHumidityLastBegin = () => ({
  type: FETCH_HUMIDITY_LAST_BEGIN
});

export const fetchHumidityLastSuccess = data => ({
  type: FETCH_HUMIDITY_LAST_SUCCESS,
  payload: { data }
});

export const fetchHumidityLastFailure = error => ({
  type: FETCH_HUMIDITY_LAST_FAILURE,
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
    case FETCH_HUMIDITY_BEGIN:
      return {
        ...state,
        loading: true
      };
    case FETCH_HUMIDITY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.data
      };
    case FETCH_HUMIDITY_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    case FETCH_HUMIDITY_LAST_BEGIN:
      return {
        ...state,
        loadingLast: true
      };
    case FETCH_HUMIDITY_LAST_SUCCESS:
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
    case FETCH_HUMIDITY_LAST_FAILURE:
      return {
        ...state,
        loadingLast: false,
        error: action.payload.error
      };
    default:
      return state;
  }
}
