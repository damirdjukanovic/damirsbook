import React, {useEffect, useState} from 'react';
import Online from "../online/Online";
import axios from "axios";
import {connect} from "react-redux";
import PropTypes from "prop-types"; 
import {Link} from "react-router-dom";

import "./RightSidebar.css";

const RightSidebar = (props) => {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/followers/" + props.currentId);
      setFriends(res.data);
    };

    getFriends();
  }, [props.currentId]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => props.onlineUsers.includes(f._id)));
  }, [friends, props.onlineUsers]);


  return (
    <div className="right-sidebar">
      <div className="right-sidebar-wrapper">
        <div className="right-sidebar-ad">
          <img src="/assets/ad.jpg" alt="ad" />
        </div>
        <div className="right-sidebar-onlinefriends">
          <span>Online friends</span>
          <hr />
          {onlineFriends.length > 0 ? onlineFriends.map(f => (
            <Link to={`/profile/${f.username}` } key={f._id}>
              <Online isOnline={true} friend={f} />
            </Link>
          )) : <span>No online friends</span>}
        </div>
      </div>
    </div>
  )
}


RightSidebar.propTypes = {
  usersOnline: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  usersOnline: state.auth.usersOnline
});

export default connect(mapStateToProps,null)(RightSidebar);