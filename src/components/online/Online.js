import React from 'react'
import "./Online.css";

export default function Online(props) {


  const {isOnline, friend} = props;
  return (
    <div className="online-friend">
      <div className="online-friend-img-container">
        <img className="online-friend-img" src={friend && friend.profilePicture} alt="profile" />
        { isOnline && <span className="online-activity"></span> } 
      </div>
      <span className="online-friend-name">{friend && friend.fullname}</span>
    </div>
  )
}
