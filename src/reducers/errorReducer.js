/* eslint-disable import/no-anonymous-default-export */
import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {
  msg: {},
  status: null,
  id: null
}

export default function(state=initialState, action){
  switch(action.type){
    case GET_ERRORS:
      return {
        status: action.payload.status,
        msg: action.payload.msg,
        id: action.payload.id
      };
    case CLEAR_ERRORS: 
      return {
        msg: {},
        status: null,
        id: null
      }  
    default:
      return state; 
  }
}