import "./Message.css";
import { format } from "timeago.js";
import React, {useEffect, useState} from "react";
import axios from "axios";

export default function Message({ message, own, friend }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios.get("https://damirsbook.herokuapp.com/api/users/?userId=" + friend)
      .then(res => setUser(res.data))
      .catch(err => err.message);
  }, [friend])

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
      {!own && <img
        className="messageImg"
        src={user?.profilePicture}
        alt=""
      />}
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}



