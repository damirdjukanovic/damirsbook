import axios from "axios";
import { returnErrors } from "./errorActions";
import  {USER_LOADING, USER_LOADED, AUTH_ERROR,LOGIN_SUCCESS ,LOGIN_FAIL,LOGOUT_SUCCESS ,REGISTER_SUCCESS ,REGISTER_FAIL} from "./types";


export const loadUser = () => (dispatch, getState) => {
  dispatch({
    type: USER_LOADING
  });
  axios.get("https://damirsbook.herokuapp.com/api/auth/getUser", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: USER_LOADED,
        payload: res.data
      })
    })
    .catch(err => {
        dispatch(returnErrors(err.response.data, err.response.status));
        dispatch({
          type: AUTH_ERROR
        })
      })
    }

export const register = ({username, email, fullname, password}) => (dispatch) => {

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  const parsedBody = JSON.stringify({username, email, fullname,password});


  axios.post("https://damirsbook.herokuapp.com/api/auth/register", parsedBody, config)
    .then(res => {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      })
    })
    .catch(err => {
      console.log(err);
      dispatch(returnErrors(err.response.data, err.response.status, "REGISTER_FAIL"));
      dispatch({
        type: REGISTER_FAIL
      })
    });
}    

export const login = ({username, password}) => (dispatch, getState) => {

  const body = JSON.stringify({username, password});

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  axios.post("https://damirsbook.herokuapp.com/api/auth/login", body, config)
    .then(res => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, "LOGIN_FAIL"));
      dispatch({
        type: LOGIN_FAIL
      });
    })
}

export const logout = () => {
  return {
      type: LOGOUT_SUCCESS
  }
}


export const tokenConfig = getState => {
  const token = getState().auth.token;

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  }

  if(token){
    config.headers["x-auth-token"] = token;
  }
  return config
}

export const follow = (userId) => (dispatch) => {
  dispatch({
    type: "follow",
    payload: userId
  })
}

export const unfollow = (userId) => (dispatch) => {
  dispatch({
    type: "unfollow",
    payload: userId
  })
}

export const usersOnline = (users) => (dispatch) => {
  dispatch({
    type: "usersOnline",
    payload: users
  })
}