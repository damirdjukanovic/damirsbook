import React, {useEffect, useState} from 'react';
import "./AboutPopup.css";
import Online from "../online/Online";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import axios from "axios";

export default function Popup(props) {

  const [followers, setFollowers] = useState([])
  useEffect(() => {
    const fetchFollowers = async () => {
      const res = await axios.get("https://damirsbook.herokuapp.com/api/users/followers/" + props.user._id);
      setFollowers(res.data);
    }
    fetchFollowers();
  }, [props.user._id]);

  return (
    <ClickAwayListener disableAutoFocus={false}	onClickAway={props.handleClickAway}>
    <div className="Popup">
      <div className="popup-wrapper">
        <div className="popup-top">
          <p><span className="info-bolded">City:</span>{props.currentUser._id === props.user._id ? props.from1 : props.user.from}</p>
          <p><span className="info-bolded">Age:</span>{props.currentUser._id === props.user._id ? props.age1 : props.user.age}</p>
          <p><span className="info-bolded">Relationship:</span>{props.currentUser._id === props.user._id ? props.relationship1 : props.user.relationship}</p>
        </div>
        <br />
        <h5 className="popup-h5">Followers</h5>
        <div className="popup-bottom">
          {followers.map(f => (
            <Online isOnline={false} friend={f}/>
          ))}
        </div>
      </div>
    </div>
    </ClickAwayListener>
  )
}
