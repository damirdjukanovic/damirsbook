import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';
import Conversation from "../conversations/Conversation";
import ChatOnline from "../chatOnline/ChatOnline";
import "./MessengerDrawer.css";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function MessengerDrawer(props) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      style={{overflow:"scroll"}}
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="msg-drawer-top">
        <h6>Your conversations</h6>
        <hr className="msg-drawer-hr"/>
        {props.conversations.map((c) => (
          <div key={c._id} onClick={() => props.setCurrentChat(c)}>
            <Conversation isMobile={true} conversation={c} currentUser={props.currentUser} />
          </div>
        ))}
      </div>
      <div className="msg-drawer-bottom">
        <h6>Online friends</h6>
        <hr className="msg-drawer-hr"/>
        <ChatOnline
          onlineUsers={props.onlineUsers}
          currentId={props.currentId}
          setCurrentChat={props.setCurrentChat}
        />
      </div>
    </div>
  );

  return (
    <div>
        <React.Fragment key={"buttom"}>
          <SmsOutlinedIcon fontSize={props.isMain ? "large" : "medium"} onClick={toggleDrawer("bottom", true)}>{"bottom"}</SmsOutlinedIcon>
          <SwipeableDrawer
            anchor={"bottom"}
            open={state["bottom"]}
            onClose={toggleDrawer("bottom", false)}
            onOpen={toggleDrawer("bottom", true)}
          >
            {list("bottom")}
          </SwipeableDrawer>
        </React.Fragment>
    </div>
  );
}