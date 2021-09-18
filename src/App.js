import React, {useEffect} from 'react';
import store from "./store";
import {loadUser} from "./actions/authActions";
import Main from "./Main";
import { Provider } from 'react-redux';


import {
  BrowserRouter as Router,
} from "react-router-dom";

export default function App() {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);


  return (
    <Provider store={store}>
      <Router>
          <Main />
      </Router>
    </Provider>  
  )

  }