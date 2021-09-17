import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import "./LikeDialog.css";
import axios from "axios";

function SimpleDialog(props) {
  
  const { onClose, selectedValue, open, users} = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return ( 
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
    <div className="LikePopup">
    <div className="popup-wrapper">
      <div className="popup-bottom">
        <h5>Liked by:</h5>
        { users && users.length >= 1 ? users.map((u) => {
            return (
            <div key={u.fullname} className="online-friend">
            <div className="online-friend-img-container">
              <img className="online-friend-img" src={u.profilePicture} alt="likes" />
            </div>
          <span className="online-friend-name">{u.fullname}</span>
          </div> )            
        })
        : <h5 className="no-likes">No likes yet</h5>}
      </div>
    </div>
  </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string,
};

export default function LikeDialog({post, numOfLikes, handleLike}) {

  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchPostsLikes = async () => {
      const res = await axios.get(`/posts/${post._id}/likes`);
      setUsers(res.data);
    }
    fetchPostsLikes();

  }, [post._id, numOfLikes]);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <React.Fragment>
    <img className="like" src="/assets/like.png" alt="like" onClick={handleLike}/>
      <span className="handle-comment-click" onClick={handleClickOpen}>
      <span className="post-bottom-left-numberOfLikes"> {users.length} people like this </span>
      </span>
      <SimpleDialog open={open} onClose={handleClose} numOfLikes={numOfLikes} users={users} post={post} key={post._id}/>
    </React.Fragment>
  );
}