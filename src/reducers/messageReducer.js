/* eslint-disable import/no-anonymous-default-export */
import { UPDATE_MESSAGE, CHECK_UNREAD, GET_MESSAGES, ADD_MESSAGE, VALIDATE_READ} from "../actions/types"

const initialState = {
  conversations: null,
  allMessages: [],
  read: null
}

export default function(state = initialState, action) {
  switch(action.type) {
    case CHECK_UNREAD: 
      return {
        ...state,
        read: action.payload
      };
    case UPDATE_MESSAGE:
      return {
        ...state,
        read: true,
        allMessages: state.allMessages.map(m => {
          if (m._id === action.payload.id) {
            return {
              ...m,
              read: true
            }
          } else {
            return m
          }
        })
      };
    case GET_MESSAGES:
      return {
        ...state,
        allMessages: [...state.allMessages, ...action.payload]
      };
    case ADD_MESSAGE: 
      return {
        ...state,
        read: false,
        allMessages: [...state.allMessages, action.payload]
      };
    case VALIDATE_READ:
      return {
        ...state,
        read: action.payload
      }      
      default:
        return state;
        } 
  }
