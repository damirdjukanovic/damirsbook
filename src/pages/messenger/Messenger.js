import "./Messenger.css";
import Navbar2 from "../../components/navbar/Navbar2";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import MessengerDrawer from "../../components/messengerDrawer/MessengerDrawer";
import axios from "axios";
import { io } from "socket.io-client";
import React,{ useEffect, useRef, useState } from "react";
import socket from "../../Socket"
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {useParams} from "react-router";


  const Messenger = (props) => {

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [receiver, setReceiver] = useState(null);

  const {user} = props;
  const scrollRef = useRef();
  const {id} = useParams();


  useEffect(() => {
    if (id){
      axios.get(`https://damirsbook.herokuapp.com/api/conversations/find/${user._id}/${id}`)
        .then(res => setCurrentChat(res.data))
        .catch(err => console.log(err));
    }
  }, [id, user._id])

  useEffect(() => {
    
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

   
  }, []);

  useEffect(() => {
    const receiverId = currentChat?.members.find(
      (member) => member !== user._id
    );
    setReceiver(receiverId)
  }, [currentChat, user._id])

  useEffect(() => {
    // props.validateRead(user._id);
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
      

  }, [arrivalMessage, currentChat]);


  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("https://damirsbook.herokuapp.com/api/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user?._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("https://damirsbook.herokuapp.com/api/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
    
  }, [currentChat]);

  const handleSubmit = async (e) => {
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );


    
    socket.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
      fullname: user.fullname
    });

    try {
      const res = await axios.post("https://damirsbook.herokuapp.com/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUserKeyPress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(); 
    }
};
  return (
    <React.Fragment>
      <Navbar2 user={user} onlineUsers={props.onlineUsers}/>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
             <h6>Your conversations</h6>
             <hr/>
            {conversations.map((c) => (
              <div key={c._id} onClick={() => setCurrentChat(c)}>
                <Conversation isMobile={false} conversation={c} currentChat={currentChat} currentUser={user} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <React.Fragment>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div key={m._id} ref={scrollRef}>
                      <Message message={m} own={m.sender === user._id} friend={receiver}/>
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleUserKeyPress}
                    value={newMessage}
                  ></textarea>
                  <div className="chat-button-container">
                    <button className="chatSubmitButton" type="submit"  disabled={newMessage.length === 0} onClick={handleSubmit}>
                      Send
                    </button>
                    <MessengerDrawer 
                      className="chat-options" 
                      conversations={conversations} 
                      setCurrentChat={setCurrentChat} 
                      currentUser={user} 
                      onlineUsers={props.onlineUsers} 
                      currentId={user._id} 
                      isMain={false}/>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
                <MessengerDrawer 
                      className="chat-options" 
                      conversations={conversations} 
                      setCurrentChat={setCurrentChat} 
                      currentUser={user} 
                      onlineUsers={props.onlineUsers} 
                      currentId={user._id} 
                      isMain={true} />
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={props.onlineUsers}
              currentId={user._id}
              setCurrentChat={setCurrentChat}
            />  
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

Messenger.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.auth.user
})
 
export default connect(mapStateToProps, null)(Messenger);
