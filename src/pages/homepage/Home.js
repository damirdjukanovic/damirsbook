import React, {useEffect, useState, useRef} from 'react';
import Navbar2 from "../../components/navbar/Navbar2";
import LeftSidebar from "../../components/leftSidebar/LeftSidebar";
import Feed from "../../components/feed/Feed";
import RightSidebar from "../../components/rightSidebar/RightSidebar";
import "./Home.css";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {useHistory} from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import socket from "../../Socket";
import { ToastContainer } from "react-toastr";
import {toastr} from 'react-redux-toastr'


const Home = (props) => {

  const history = useHistory();
  const [user, setUser] = useState({});

  useEffect(() => {
    
    const fetchUser = async() => {
      const user = await axios.get("/users/?userId=" + props.user?._id);
      setUser(user.data);
    }
    if(props.user) {
      fetchUser(); 
    }

  }, [history, props.isAuthenticated, props.user]);

 

  useEffect(() => {
    
    socket.on("getMessage", (data) => {
        toastr.success(`${data.fullname} said:`, data.text)
    })
}, []);

  return (
    <React.Fragment>
      <Navbar2 user={user} onlineUsers={props.onlineUsers}/>
      <div className="home-container ">
        <LeftSidebar user={user}/>
        <Feed isProfile={false} user={user}/>
        <RightSidebar user={user} currentId={props.user._id} onlineUsers={props.onlineUsers}/>
      </div>
    </React.Fragment>
  )
}

Home.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
})

export default connect(mapStateToProps,null)(Home);