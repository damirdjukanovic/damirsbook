/* eslint-disable default-case */
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL
} from '../actions/types';

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  usersOnline: []
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state=initialState, action){
  switch (action.type) {
    case USER_LOADING: 
      return {
        ...state,
        isLoading: true
      };
    case USER_LOADED: 
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem("token", action.payload.token); 
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      };
      case AUTH_ERROR:
      case LOGIN_FAIL:
      case LOGOUT_SUCCESS:
      case REGISTER_FAIL:
        localStorage.removeItem('token');
        return {
          ...state,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          user: null,
        };
        case "follow":
          return {
            ...state,
            user: {
              ...state.user,
              followings: [...state.user.followings, action.payload]
            }
          };
          case "unfollow":
          return {
            ...state,
            user: {
              ...state.user,
              followings: state.user.followings.filter(following => following !== action.payload)
            }
          };
          case "usersOnline":
            return {
              ...state,
              usersOnline: action.payload
            };    
        default: 
          return state;  
  }
}