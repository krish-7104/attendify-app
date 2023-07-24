import { SET_VALUE } from "./action";

export const Reducers = (state = [], action) => {
  switch (action.type) {
    case SET_VALUE:
      return action.payload;
    default:
      return state;
  }
};
