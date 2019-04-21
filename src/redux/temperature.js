import { random } from "../utils";
import axios from "axios";

import { addAlarm } from "./alarm";

export const FETCH_TEMPARATURE_BEGIN = "FETCH_TEMPARATURE_BEGIN";
export const FETCH_TEMPARATURE_SUCCESS = "FETCH_TEMPARATURE_SUCCESS";
export const FETCH_TEMPARATURE_FAILURE = "FETCH_TEMPARATURE_FAILURE";

export const FETCH_TEMPERATURE_LAST_BEGIN = "FETCH_TEMPERATURE_LAST_BEGIN";
export const FETCH_TEMPERATURE_LAST_SUCCESS = "FETCH_TEMPERATURE_LAST_SUCCESS";
export const FETCH_TEMPERATURE_LAST_FAILURE = "FETCH_TEMPERATURE_LAST_FAILURE";

var config = {
  headers: {
    Accept: "application/json"
  }
};

const FAKE = false;

function realGetLast() {
  return axios.get(window.APP_HOST + "/api/temperature/last", config);
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
    // Resolve after a timeout so we can see the loading indicator
    setTimeout(
      () =>
        resolve({
          data: [
            {
              id: 0,
              value: 16
            },
            {
              id: 1,
              value: 12
            },
            {
              id: 2,
              value: 14
            },
            {
              id: 3,
              value: 17
            },
            {
              id: 4,
              value: 21
            },
            {
              id: 5,
              value: 6
            },
            {
              id: 6,
              value: 7
            }
          ]
        }),
      1500
    );
  });
}

function realGetAll() {
  return axios.get(window.APP_HOST + "/api/temperature", config);
}

function getAll() {
  return FAKE ? fakeGetAll() : realGetAll();
}

const handleAddAlarm = (level, value) =>
  addAlarm({
    name: "TEMPERATURE",
    value: value,
    level: level
  });

export function fetchLastItem() {
  return dispatch => {
    dispatch(fetchTemperatureLastBegin());
    return getLast()
      .then(({ data }) => {
        if (data.value >= 35) {
          dispatch(handleAddAlarm("HiHi", data.value));
        } else if (data.value >= 30) {
          dispatch(handleAddAlarm("Hi", data.value));
        } else if (data.value <= -10) {
          dispatch(handleAddAlarm("LoLo", data.value));
        } else if (data.value <= 0) {
          dispatch(handleAddAlarm("Lo", data.value));
        }
        dispatch(fetchTemperatureLastSuccess(data));
        return data;
      })
      .catch(error =>
        dispatch(fetchTemperatureLastFailure("Error fetch TEMPERATURE"))
      );
  };
}

export function fetchItems() {
  return dispatch => {
    dispatch(fetchTemperatureBegin());
    return getAll()
      .then(json => {
        dispatch(fetchTemperatureSuccess(json.data));
        return json.data;
      })
      .catch(error =>
        dispatch(fetchTemperatureFailure("Error fetch TEMPERATURE"))
      );
  };
}

export const fetchTemperatureBegin = () => ({
  type: FETCH_TEMPARATURE_BEGIN
});

export const fetchTemperatureSuccess = data => ({
  type: FETCH_TEMPARATURE_SUCCESS,
  payload: { data }
});

export const fetchTemperatureFailure = error => ({
  type: FETCH_TEMPARATURE_FAILURE,
  payload: { error }
});

export const fetchTemperatureLastBegin = () => ({
  type: FETCH_TEMPERATURE_LAST_BEGIN
});

export const fetchTemperatureLastSuccess = data => ({
  type: FETCH_TEMPERATURE_LAST_SUCCESS,
  payload: { data }
});

export const fetchTemperatureLastFailure = error => ({
  type: FETCH_TEMPERATURE_LAST_FAILURE,
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
    case FETCH_TEMPARATURE_BEGIN:
      return {
        ...state,
        loading: true
      };
    case FETCH_TEMPARATURE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.payload.data
      };
    case FETCH_TEMPARATURE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };
    case FETCH_TEMPERATURE_LAST_BEGIN:
      return {
        ...state,
        loadingLast: true
      };
    case FETCH_TEMPERATURE_LAST_SUCCESS:
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
        loadingLast: false,
        error: null,
        items: found ? state.items : [...state.items, action.payload.data]
      };
    case FETCH_TEMPERATURE_LAST_FAILURE:
      return {
        ...state,
        loadingLast: false,
        error: action.payload.error
      };
    default:
      return state;
  }
}
