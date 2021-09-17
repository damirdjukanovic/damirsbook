import {combineReducers} from "redux";
import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import messageReducer from "./messageReducer";
import {reducer as toastrReducer} from 'react-redux-toastr'

export default combineReducers({
  error: errorReducer,
  auth: authReducer,
  message: messageReducer,
  toastr: toastrReducer
});