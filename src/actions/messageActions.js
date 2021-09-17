import {UPDATE_MESSAGE, CHECK_UNREAD, GET_MESSAGES, GET_CONVERSATIONS, ADD_MESSAGE, VALIDATE_READ} from "./types";
import axios from "axios";

export const updateMsg = (messageId, body) => (dispatch) => {
  axios.put("/messages/" + messageId, body)
    .then(res => {
      dispatch({
        type: UPDATE_MESSAGE,
        payload: {id: messageId}
      })
    }).catch(err => console.log(err.message))
}

export const validateRead = (userId) => (dispatch) => {
  axios.get("https://damirsbook.herokuapp.com/api/conversations/" + userId)
    .then(res => {
      for(let c of res.data){
        axios.get(`https://damirsbook.herokuapp.com/api/messages/${c._id}/unread`)
        .then(res2 => {
          dispatch({
            type: VALIDATE_READ,
            payload: res2.data
          })
        }).catch(err => console.log(err.message))
      }
    })
    .catch(err2 => console.log(err2));
}

export const checkMsg = () => (dispatch, getState) => {
  const state = getState();

      if(state.message.allMessages.some(m => m.read === false)) {
        dispatch({
          type: CHECK_UNREAD,
          payload: false
        })
      } else {
        dispatch({
          type: CHECK_UNREAD,
          payload: true
        })
      }
    }

export const addMsg = (message) => (dispatch) => {
 
  dispatch({
    type: ADD_MESSAGE,
    payload: message
  })
}

export const getMessages = (userId) => (dispatch) => {
   
  
  axios.get("/conversations/" + userId)
    .then(res => {
      for(let c of res.data){
        console.log("convo: ", res.data);
        axios.get("https://damirsbook.herokuapp.com/api/messages/" + c._id)
        .then(res2 => {
          dispatch({
            type: GET_MESSAGES,
            payload: res2.data
          })
        }).catch(err => console.log(err.message))
      }
    })
    .catch(err2 => console.log(err2));
  
}
