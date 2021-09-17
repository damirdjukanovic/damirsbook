import React, {useState, useEffect} from 'react';
import axios from "axios";
import EditPopup from "../editPopup/editPopup";
import {Link} from "react-router-dom";

export default function ProfileRightSidebar({user, currentUser, handleRandomCounter, randomCounter, reduxUser}) {

  const [followers, setFollowers] = useState([]);

  const [age1, setAge1] = useState(reduxUser.age);
  const [from1, setFrom1] = useState(reduxUser.from);
  const [relationship1, setRelationship1] = useState(reduxUser.relationship);


  useEffect(() => {
    const fetchFollowers = async () => {
      const res = await axios.get("/users/followers/" + user._id);
      setFollowers(res.data);
    }
    fetchFollowers();
  }, [user._id, randomCounter]);

  return (
    <div className="ProfileRightSidebar">
      <div className="right-sidebar-wrapper">
        <div className="profile-rightsidebar-top">
          <span className="prof-info">Profile Information</span>
          <p className="hide">{randomCounter}</p>
          {(currentUser.username === user.username) && <EditPopup currentUser={currentUser} setAge1={setAge1} setFrom1={setFrom1} setRelationship1={setRelationship1} />}
          <p><span className="info-bolded">City:</span>{currentUser._id === user._id ? from1 : user.from}</p>
          <p><span className="info-bolded">Age:</span>{currentUser._id === user._id ? age1 : user.age}</p>
          <p><span className="info-bolded">Relationship:</span>{currentUser._id === user._id ? relationship1 : user.relationship}</p>
        </div>
        <br />
      <h5>Followers</h5>
      <div className="profile-rightsidebar-bottom">
      {followers.map((f) => (
        <Link key={f.username} to={`/profile/${f.username}`}>
          <div className="profile-sidebar-friend">
            <img className="profile-friend-image" src={f.profilePicture} alt="rock" />
            <span>{f.fullname}</span>
          </div>
        </Link>
      ))}
      </div>
      </div>
    </div>
  )
}
