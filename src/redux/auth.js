export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export const login = data => ({
  type: LOGIN,
  payload: { ...data }
});

export const logout = () => ({
  type: LOGOUT
});

const initialState = {
  user: null,
  permission: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        user: action.payload.user,
        permission: action.payload.permission
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
