import React, {useEffect, useState} from 'react';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Home from "./pages/homepage/Home";
import Profile from "./pages/profile/Profile";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import Messenger from "./pages/messenger/Messenger";
import store from "./store";
import {getMessages} from "./actions/messageActions";
import socket from "./Socket";
import { LoopCircleLoading } from 'react-loadingg';
import ReduxToastr from 'react-redux-toastr'; 

import {
  Switch,
  Route,
  Redirect
} from "react-router-dom";

export const NotAuthorized = () => {
  return (
    <div>NOT AUTHORIZED</div>
  )
}

const Main = (props) => {

  const {isAuthenticated, isLoading, user} = props;
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if(user) {
      store.dispatch(getMessages(user._id));
    }
    if(isAuthenticated) {
      socket.emit("addUser", user._id);
      socket.on("getUsers", (users) => {
        setOnlineUsers(
          user.followings.filter((f) => users.some((u) => u.userId === f))
        );
      });
    }
  }, [user, isAuthenticated]);

  if(isLoading) {
    return <LoopCircleLoading />
  }
  
  return (
        <Switch>
        <Route exact path="/home">
          {isAuthenticated ? <Home onlineUsers={onlineUsers} /> : <Login />}
          <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="bottom-right"
          getState={(state) => state.toastr}
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          closeOnToastrClick/> 
         </Route>
         <Route exact path="/">
          {isAuthenticated ? <Redirect to="/home" /> : <Login />}
         </Route>
         <Route exact path="/register">
           {isAuthenticated ? <Redirect to="/home" /> : <Register />}
         </Route>
         <Route exact path="/profile/:username">
         {isAuthenticated ? <Profile user={user} onlineUsers={onlineUsers}/> : <LoopCircleLoading />}
         <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="bottom-right"
          getState={(state) => state.toastr}
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          closeOnToastrClick/>  
         </Route>
         <Route exact path="/messenger">
         {isAuthenticated ? <Messenger onlineUsers={onlineUsers}/> : <LoopCircleLoading />} 
         </Route>
         <Route exact path="/messenger/:id">
         {isAuthenticated ? <Messenger onlineUsers={onlineUsers} /> : <LoopCircleLoading />} 
         </Route>
        </Switch>
  );
}

Main.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
  user: PropTypes.object
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  user: state.auth.user
})

export default connect(mapStateToProps, null)(Main);
