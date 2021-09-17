import React, {useEffect} from 'react';
import store from "./store";
import {loadUser} from "./actions/authActions";
import Main from "./Main";
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr'

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
          <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="bottom-right"
          getState={(state) => state.toastr}
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          closeOnToastrClick/>
      </Router>
    </Provider>  
  )

  }