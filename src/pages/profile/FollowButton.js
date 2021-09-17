import React, {useState, useEffect} from 'react';
import axios from "axios";
import socket from "../../Socket"

export default function FollowButton(props) {

  const [isFollowed, setIsFollowed] = useState(props.currentUser.followings.includes(props.user._id));

  const handleFollow = async () => {
    const body = {
      userId: props.currentUser._id
    }

    if(isFollowed) {
      try {
        await axios.put(`https://damirsbook.herokuapp.com/api/users/${props.user._id}/unfollow`, body);
        await axios.put(`https://damirsbook.herokuapp.com/api/users/notifications/${props.user._id}/delete`,{senderId: props.currentUser._id})
      } catch(err) {
        console.log(err)
      }
      setIsFollowed(!isFollowed);
      props.unfollow(props.user._id);
      props.handleRandomCounter();
    } else {
      try {
        await axios.put(`https://damirsbook.herokuapp.com/api/users/${props.user._id}/follow`, body);
        await axios.post(`https://damirsbook.herokuapp.com/api/users/notifications/${props.user._id}`, {
          fullname: props.currentUser.fullname,
          createdAt: Date.now(),
          username: props.currentUser.username,
          senderId: props.currentUser._id
        });
        socket.emit("follow", ({
          receiverId: props.user._id, 
          fullname: props.currentUser.fullname,
          createdAt: Date.now(),
          username: props.currentUser.username
        }))
      } catch(err) {
        console.log(err);
      }
      setIsFollowed(!isFollowed);
      props.handleRandomCounter();
      props.follow(props.user._id);
    }

  }

  return (
    <React.Fragment>
      <button className="follow-button" onClick={handleFollow}>{isFollowed ? "Unfollow" : "Follow"}</button>
    </React.Fragment>
  )
}
