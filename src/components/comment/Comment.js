import React, {useState, useEffect} from 'react';
import "./Comment.css";
import SendIcon from '@material-ui/icons/Send';
import axios from "axios";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import ConfirmationDialog from "../confirmationDialog/ConfirmationDialog";

const Comment = ({comment, currentUser, handleCommentCounter, handleCommentsLengthMinus}) => {

  return (
    <div className="comment">
      <div className="comment-wrapper">
        <div className="comment-picture-container">
          <img className="comment-picture" src={comment.profilePicture} alt="" />
        </div>
        <div className="comment-container">
          <div className="comment-delete-container">
            <span className="comment-username">{comment.fullname}</span>
            {(currentUser._id === comment.userId) &&
            <span className="comm-dlt"><ConfirmationDialog handleCommentCounter={handleCommentCounter} comment={comment} currentUser={currentUser} handleCommentsLengthMinus={handleCommentsLengthMinus}/></span>
            }
            </div>
          <span className="comment-text">{comment.desc}</span>
        </div>
      </div>
    </div>
  )
}

const Comments = (props) => {

  const {post} = props;
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [desc, setDesc] = useState("");
  const [commentCounter, setCommentCounter] = useState(1);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await axios.get("/comments/" + post._id)
      setComments(res.data.sort((p1, p2) => {
        return new Date(p1.createdAt) - new Date(p2.createdAt);
      }));
    }
    fetchComments();
  }, [post._id, props.commentsLength, commentCounter]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const res = await axios.get("/users/?userId=" + props.user._id);
      setCurrentUser(res.data);
    };
    fetchCurrentUser();
  }, [props.user._id])

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    const config = {
      headers: {
        "Content-Type" : "application/json"
      }
    }
    const body = {
      userId: currentUser._id,
      postId: props.post._id,
      fullname: currentUser.fullname,
      profilePicture: currentUser.profilePicture,
      username: currentUser.username,
      desc: desc
    }
    await axios.post("/comments/", body, config);
    setDesc("");

    props.handleCommentsLength();

  }

  function handleCommentCounter(){
    setCommentCounter(commentCounter+1)
  }

  const handleChange = (e) => {
    setDesc(e.target.value);
  }

  return (
    <div className={`comments ${props.commentIsOpen ? "show" : ""}`}>
    <hr />

      <div className="comments-container">
      <div className="comments-textfield">
        <img className="comment-picture" src={currentUser.profilePicture} alt="" />
        <form onSubmit={handleSubmit}>
        <div className="comments-textfield-input">
          <input placeholder="Write a comment..." className="comments-input" type="text" name="description" value={desc} onChange={handleChange}/>
          <div className="send-icon">
            <SendIcon onClick={handleSubmit} disabled={desc === ""}/>
          </div>
        </div>
        </form>
      </div>
        {comments.map(c => (
          <Comment comment={c} key={c._id} handleCommentsLengthMinus={props.handleCommentsLengthMinus} currentUser={currentUser} handleCommentCounter={handleCommentCounter}/>
        ))}
      </div>
    </div>

  )
}

Comments.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  user: state.auth.user
})

export default connect(mapStateToProps,null)(Comments);