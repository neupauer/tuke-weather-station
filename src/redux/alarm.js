export const ADD_ALARM = "ADD_ALARM";
export const DONE_ALARM = "DONE_ALARM";

export const addAlarm = data => ({
  type: ADD_ALARM,
  payload: { data }
});

export const doneAlarm = data => ({
  type: DONE_ALARM,
  payload: { data }
});

const initialState = {
  items: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case DONE_ALARM:
      const foundA = state.items.find(
        item => item.id === action.payload.data.id
      );
      const filterA = state.items.filter(
        item => item.id !== action.payload.data.id
      );
      return {
        ...state,
        items: [...filterA, { ...foundA, done: true }]
      };

    case ADD_ALARM:
      const found = state.items.find(
        item => item.valueId === action.payload.data.valueId
      );

      if (found) {
        return state;
      }

      return {
        ...state,
        items: [
          ...state.items,
          { ...action.payload.data, id: state.items.length + 1, done: false }
        ]
      };
    default:
      return state;
  }
}
