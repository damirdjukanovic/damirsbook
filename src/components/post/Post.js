import React from 'react';
import "./Post.css";
import axios from 'axios';
import {useState, useEffect} from 'react';
import { format } from "timeago.js";
import Popup from "../aboutPopup/AboutPopup";
import LikeDialog from "../dialog/LikeDialog";
import { Link } from "react-router-dom";
import Comments from "../comment/Comment";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";


export default function Post({post, user: currentUser, handleRandomCounter}) {


  const [user, setUser] = useState({});
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(null);
  const [likeIsOpen, setLikeIsOpen] = useState(false);
  const [commentIsOpen, setCommentIsOpen] = useState(false)
  const [commentsLength, setCommentsLength] = useState(post.comments.length);


  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/?userId=${post.userId}`);
      setUser(res.data);
    }
    fetchUser();
    setNumOfLikes(post.likes.length);
  }, [post.userId, post.likes.length, numOfLikes])

  const handleCommentsLength = () => {
    setCommentsLength(commentsLength + 1);
  }

  const handleCommentsLengthMinus = () => {
    setCommentsLength(commentsLength - 1);
  }

  const handleLike = async () => {
    
    setIsLiked(!isLiked);

    if(isLiked) {
      setNumOfLikes(numOfLikes - 1)
    } else {
      setNumOfLikes(numOfLikes + 1);
    }
    

    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const body = JSON.stringify({userId: currentUser._id});

    await axios.put(`/posts/${post._id}/like`, body, config);

    setNumOfLikes(post.likes.length);
    
  }


  function handleClickAway(){
    setLikeIsOpen(false);
  }

  function handleCommentClick(){
    setCommentIsOpen(!commentIsOpen);
  }



  return (
    <React.Fragment>
    {likeIsOpen && <Popup handleClickAway={handleClickAway} /> }
    <div className="post">
      <div className="post-wrapper">
        <div className="post-top">
          <Link to={`/profile/${user.username}`}>
          <img className="post-profile-picture" src={user.profilePicture} alt="profile" />
          </Link>
          <div className="post-name-container">
            <span className="post-user-name">{user.fullname}</span>
            <span className="post-date">{format(post.createdAt)}</span>
          </div>
          {(currentUser._id === user._id) &&
            <span className="delete-icon"><ConfirmationDialog handleRandomCounter={handleRandomCounter} post={post}/></span>
          }
        </div>
        <div className="post-center">
          <span className="post-description">{post.desc}</span>
          {post.img && <img className="post-picture" src={post.img} alt="post" />}
        </div>
        <div className="post-bottom">
          <div className="post-bottom-left">
            <LikeDialog post={post} numOfLikes={numOfLikes} handleLike={handleLike}/>
          </div>
          <div className="post-bottom-right">
            <span className="post-bottom-comments" onClick={handleCommentClick}>{commentsLength} comments</span>
          </div>
        </div>
      </div>
      <Comments currentUser={currentUser} commentIsOpen={commentIsOpen} post={post} handleCommentsLength={handleCommentsLength} commentsLength={commentsLength} handleCommentsLengthMinus={handleCommentsLengthMinus}/>
    </div>
    </React.Fragment>
  )
}
