import { SET_VALUE } from "./action";

export const setValueHandler = (data) => ({
  type: SET_VALUE,
  payload: data,
});
