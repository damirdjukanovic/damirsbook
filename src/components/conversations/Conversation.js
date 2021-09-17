import axios from "axios";
import { useEffect, useState } from "react";
import "./Conversation.css";

const Conversation = ({ conversation, currentUser, isMobile, currentChat}) => {
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios("https://damirsbook.herokuapp.com/api/users/?userId=" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className={isMobile ? "conversation-mobile" : `${conversation._id === currentChat?._id ? "isActive" : ""} conversation`}>
      <img
        className="conversationImg"
        src={
          user?.profilePicture
        }
        alt=""
      />
      <span className={isMobile ? "conversationName-mobile" : "conversationName"}>{user?.fullname}</span> 
    </div>
  );
}
export default Conversation;