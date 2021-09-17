import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@material-ui/icons";

import Online from "../online/Online";
import "./leftSidebar.css";
import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom";

export default function LeftSidebar({user, randomCounter}) {

  const [followings, setFollowings] = useState([]);

  useEffect(() => {
    const fetchFollowings = async() => {
      const res = await axios.get("/users/followings/" + user._id);
      setFollowings(res.data);
      
    }
    fetchFollowings();
  }, [user._id, randomCounter]);

  return (
    <div className="leftSidebar">
      <div className="left-sidebar-wrapper">
        <ul className="left-sidebar-list">
          <li className="left-sidebar-list-item">
            <RssFeed className="left-sidebar-icon" />
            <span className="left-sidebar-item-text">Feed</span>
          </li>
          <li className="left-sidebar-list-item">
            <Chat className="left-sidebar-icon" />
            <span className="left-sidebar-item-text">Chat</span>
          </li>
          <li className="left-sidebar-list-item">
            <PlayCircleFilledOutlined className="left-sidebar-icon" />
            <span className="left-sidebar-item-text">Video</span>
          </li>
          <li className="left-sidebar-list-item">
            <Group className="left-sidebar-icon" />
            <span className="left-sidebar-item-text">Groups</span>
          </li>
          <li className="left-sidebar-list-item">
            <Bookmark className="left-sidebar-icon" />
            <span className="left-sidebar-item-text">Bookmarks</span>
          </li>
          <li className="left-sidebar-list-item">
            <HelpOutline className="left-sidebar-icon" />
            <span className="left-sidebar-item-text">Questions</span>
          </li>
          <li className="left-sidebar-list-item">
            <WorkOutline className="left-sidebar-icon" />
            <span className="left-sidebar-item-text">Jobs</span>
          </li>
          <li className="left-sidebar-list-item">
            <Event className="left-sidebar-icon" />
            <span className="left-sidebar-item-text">Events</span>
          </li>
          <li className="left-sidebar-list-item">
            <School className="left-sidebar-icon" />
            <span className="left-sidebar-item-text">Courses</span>
          </li>
          <hr className="left-sidebar-hr"/>
          <span className="left-sidebar-friends">People you follow</span>
          <br />
          <br />

          {
            followings.length > 0 ? followings.map(f => (
              <Link key={f.username} to={`/profile/${f.username}`}>
                <Online isOnline={false} friend={f} />
              </Link>
            )) : <span>You don't follow anyone yet</span>
          }
        </ul>
      </div>
    </div>
  )
}
