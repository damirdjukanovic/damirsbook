import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import axios from "axios";

export default function ConfirmationDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteComment = async() => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    }
    const body = JSON.stringify({userId: props.currentUser._id})
    await axios.put(`/comments/delete/${props.comment._id}`, body, config);
    props.handleCommentsLengthMinus();
    handleClose();
    props.handleCommentCounter();
  }

  const handleDeletePost = async() => {
    await axios.delete("/posts/" + props.post._id);
    handleClose();
    props.handleRandomCounter();
  }

  return (
    <div>
    <HighlightOffIcon fontSize={props.comment ? "small" : "medium"} htmlColor="red" onClick={handleClickOpen}/>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete this ${props.comment ? "comment" : "post"}`} 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={props.comment ? handleDeleteComment : handleDeletePost} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}