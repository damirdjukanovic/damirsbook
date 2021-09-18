import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useHistory } from "react-router-dom";
import "./Profile.css";
import Navbar2 from "../../components/navbar/Navbar2";
import Feed from "../../components/feed/Feed";
import ProfileRightSidebar from "../../components/rightSidebar/ProfileRightSidebar";
import LeftSidebar from "../../components/leftSidebar/LeftSidebar";
import Popup from "../../components/aboutPopup/AboutPopup";
import Dialog from "../../components/dialog/Dialog";
import {useParams} from "react-router";
import axios from "axios";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {follow, unfollow} from "../../actions/authActions"; 
import FollowButton from "./FollowButton";
import firebase  from "../../firebase/index";
import EditPopup from "../../components/editPopup/editPopup";
import socket from "../../Socket"
import ChatOutlinedIcon from '@material-ui/icons/ChatOutlined';


const Profile = (props) => {

  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [hasError, sethasError] = useState(false);
  const {username} = useParams();
  const [randomCounter, setRandomCounter] = useState(1);
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const history = useHistory();

  const [age1, setAge1] = useState(props.user.age);
  const [from1, setFrom1] = useState(props.user.from);
  const [relationship1, setRelationship1] = useState(props.user.relationship);

  const storage = firebase.storage();
  const storageRef = storage.ref();



  useEffect(() => {
    if(profileFile) {
      setProfilePhoto(URL.createObjectURL(profileFile))
    }
  }, [profileFile]);

  useEffect(() => {
    if(coverFile) {
      setCoverPhoto(URL.createObjectURL(coverFile))
    }
  }, [coverFile]);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        sethasError(false);
        const res = await axios.get(`https://damirsbook.herokuapp.com/api/users/?username=${username}`);
        setUser(res.data);
      } catch (err) {
        sethasError(true)
      }
      
    }
    fetchUser();
}, [username, ]);

  useEffect(() => {
    const fetchCurrentUser = async() => {
      const res = await axios.get("https://damirsbook.herokuapp.com/api/users/?username=" + props.user.username);
      setCurrentUser(res.data);
    }
    fetchCurrentUser();
  }, [props.user])
  

  function handleClickAway(){
    setPopupIsOpen(false)
  }

  if(hasError) return (
    <div>
      <p>NO USER FOUND</p>
    </div>
  )

  function handleRandomCounter() {
    setRandomCounter(randomCounter + 1)
  }

  const handleSubmit = async() => {

    const body = {
      userId: currentUser._id
    };

    try {
      if(profileFile) {
        const uploadTask = storageRef.child('folder/' + profileFile.name).put(profileFile);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) =>{
          },(error) =>{
            throw error
          },() =>{
      
            uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
              body.profilePicture = url
                axios.put(`https://damirsbook.herokuapp.com/api/users/${user._id}`, body)
                .then(res => {
                  setProfileFile(null);
                  setProfilePhoto(url)
                })
                .catch(err => console.log(err.message));
            })
         }
       )
      }
    } catch (err) {}

    
    try {
      if(coverFile) {
        const uploadTask = storageRef.child('folder/' + coverFile.name).put(coverFile);

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) =>{
          },(error) =>{
            throw error
          },() =>{
      
            uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
              body.coverPicture = url
                axios.put(`https://damirsbook.herokuapp.com/api/users/${user._id}`, body)
                .then(res => {
                  setCoverFile(null);
                  setCoverPhoto(url);
                })
                .catch(err => console.log(err.message));
            })
         }
       )
      }
    } catch (err) {}

  }

  const handleChat = async() => {
    const res = await axios.get(`https://damirsbook.herokuapp.com/api/conversations/find/${currentUser._id}/${user._id}`);
    const exists = res.data;
    if(!exists) {
      await axios.post("https://damirsbook.herokuapp.com/api/conversations/", {
        senderId: currentUser._id,
        receiverId: user._id
      });
    }
    history.push("/messenger/"+user._id);
  }

  return (
    <React.Fragment>
      { popupIsOpen && <Popup isOpen={popupIsOpen} handleClickAway={handleClickAway} user={props.user}/> } 
      <Navbar2 user={currentUser} randomCounter={randomCounter} onlineUsers={props.onlineUsers}/>
      <div className="Profile">
        <LeftSidebar user={props.user} randomCounter={randomCounter}/>
        <div className="profile-right">
          <div className="profile-right-top">
            <div className="profile-cover">
            <form onSubmit={handleSubmit}>
              <label htmlFor="coverFile">
                <img className={currentUser._id === user._id ? "profile-cover-img pointer" : "profile-cover-img"} src={(currentUser._id === user._id && coverPhoto) ? coverPhoto : user.coverPicture} alt="cover" />
                  {(currentUser._id === user._id) && 
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="coverFile"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e) => setCoverFile(e.target.files[0])}
                    />
                  }
             </label> 
            </form>  
              <form onSubmit={handleSubmit}>
                <label htmlFor="profileFile">
                  <img className={currentUser._id === user._id ? "profile-img pointer" : "profile-img"}  src={(currentUser._id === user._id && profilePhoto) ? profilePhoto : user.profilePicture} alt="profilePic" />
                    {(currentUser._id === user._id) && 
                      <input
                      style={{ display: "block" }}
                      type="file"
                      id="profileFile"
                      onChange={(e) => setProfileFile(e.target.files[0])}
                      />
                    }
                </label>
              </form>
              </div>
            <div className="profile-info">
              <span className="profile-name">{user.fullname}</span>
              {(profileFile || coverFile) && <span className="upload-span" onClick={handleSubmit}>Upload photo</span>}
                <div className="profile-info-buttons">
                {(user.username !== currentUser.username) && <FollowButton randomCounter={randomCounter} handleRandomCounter={handleRandomCounter} user={user} socket={socket} currentUser={props.user} follow={props.follow} unfollow={props.unfollow}/>}
                  <Dialog user={user} currentUser={currentUser} age1={age1} from1={from1} relationship1={relationship1}/>
                  {(currentUser.username === user.username) && <span className="editPopup-mobile"><EditPopup currentUser={currentUser} setAge1={setAge1} setFrom1={setFrom1} setRelationship1={setRelationship1} /></span>}
                  {(user.username !== currentUser.username) && <ChatOutlinedIcon fontSize="medium" style={{cursor:"pointer"}} onClick={handleChat} />}
                </div>
              </div>  
          </div>
          <div className="profile-right-bottom">
          <p className="hide">{randomCounter}</p>
            <Feed username={username} isProfile={true} user={currentUser}/>
            <ProfileRightSidebar user={user} reduxUser={props.user} handleRandomCounter={handleRandomCounter} randomCounter={randomCounter} currentUser={currentUser}/>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

Profile.propTypes = {
  follow: PropTypes.func.isRequired,
  unfollow: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};


export default connect(null, {follow, unfollow})(Profile);
