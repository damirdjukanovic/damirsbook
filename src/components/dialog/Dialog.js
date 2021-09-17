import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Online from "../online/Online";
import Popup from "../aboutPopup/AboutPopup";


export default function Dialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button style={{backgroundColor: "rgb(18, 184, 32)", fontFamily: "inherit"}} className="follow-button about-button" onClick={handleClickOpen}>
        About
      </button>
      {open && <Popup handleClickAway={handleClose} user={props.user} currentUser={props.currentUser} age1={props.age1} from1={props.from1} relationship1={props.relationship1} />}
    </React.Fragment>
  );
}