import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {logout} from "../../actions/authActions";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import {RssFeed} from "@material-ui/icons";
import ChatIcon from '@material-ui/icons/Chat';
import Online from "../online/Online";
import OutsideClickHandler from 'react-outside-click-handler';
import axios from "axios";
import socket from "../../Socket"
import "./Navbar.css";
import { format } from "timeago.js";
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  leftSidebarLink: {
    "& a": {
      color: "black !important"
    },
    marginTop: "5px",
    marginBottom: "5px"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  smallMenu: {
    "& a": {
      color: "black !important",
      textDecoration: "none"
    }
  },
  drawerPaper: {
    width: drawerWidth,
    paddingLeft: "5px",
    paddingRight: "5px"
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  grow: {
    flexGrow: 1,
    fontFamily: "'Poppins', sans-serif",
    "& a": {
      color: "white",
      textDecoration: "none",
      "& a:hover": {
        textDecoration: "none"
      }
    }
  },
  title: {
    display: 'none',
    fontSize: "30px",
    fontWeight: "600",
    marginLeft: "20px",
    cursor: "pointer",
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: "15px",
    color: "black",
    backgroundColor: "white",
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    "& input": {
      width: "100%"
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(12),
      width: '50%',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: "100%"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      alignItems: "center",
      position: "relative"
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const PrimarySearchAppBar = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [searchUsers, setSearchUsers] = React.useState([]);
  const [notifications, setNotifications] = useState([]);
  const [arrivalNotification, setArrivalNotification] = useState(null);
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);
  const [redDot, setRedDot] = useState(false);
  const [followings, setFollowings] = useState([]);
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);


  useEffect(() => {
    const fetchFollowings = async() => {
      const res = await axios.get("/users/followings/" + props.user?._id);
      setFollowings(res.data);
      
    }
    fetchFollowings();
  }, [props.user._id, props.randomCounter]);

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get("/users/followers/" + props.user?._id);
      setFriends(res.data);
    };

    getFriends();
  }, [props.user._id]);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => props.onlineUsers.includes(f._id)));
  }, [friends, props.onlineUsers]);

  useEffect(() => {
    const fetchNotifications = async() => {
      const res = await axios.get("/users/notifications/" + props.user?._id);
      setNotifications(res.data);
    };
    fetchNotifications();
  }, [props.user._id])

  useEffect(() => {
    socket.on("getNotification", (res) => {
    setArrivalNotification(res);
    setRedDot(true);
   })
  }, []);

  useEffect(() => {
    arrivalNotification && setNotifications((prev) => [...prev, arrivalNotification]);
  }, [arrivalNotification])



   const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  function handleLogout(){
    props.logout();
    history.push("/");
  }

  const debounce = (func, delay) => {
    let timerId;
    return (...args) => {
      if(timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        func.apply(null, args)
      }, delay)
    }
  }

  const handleChange = async(e) => {
    const res = await axios.get(`/users/search?query=${e.target.value}`);
    setSearchUsers(res.data);
    return;
  }

  const handleNotification = () => {
    setNotificationIsOpen(!notificationIsOpen);
    setRedDot(false);
  }


  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      className={classes.smallMenu}
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <Link to="/messenger">
        <MenuItem>
          <IconButton aria-label="show 4 new mails" color="inherit">
            <Badge color="secondary">
              <ChatIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
      </Link> 
      <Link to="/">
        <MenuItem>
          <IconButton aria-label="show 11 new notifications" color="inherit">
              <RssFeed />
          </IconButton>
          <p>Home</p>
        </MenuItem>
      </Link>
      <Link to={`/profile/${props.user.username}`}>
        <MenuItem >
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
        </Link>
        <MenuItem onClick={handleLogout}>
          <IconButton aria-label="logout">
           <MeetingRoomIcon htmlColor="black" />
          </IconButton>
          <p>Log out</p>
        </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar className="sticky">
        <Toolbar>
        <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        className={`${clsx(classes.menuButton, open && classes.hide)} nav-menu-btn`}
      >
        <MenuIcon/>
          </IconButton>
          <Link to="/">
            <Typography className={classes.title} variant="h6" noWrap>
              Damirsbook
            </Typography>
          </Link>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={debounce(handleChange,300)}
            />
            {(searchUsers.length > 0) && 
              <div className="search-results">
              <OutsideClickHandler
                onOutsideClick={() => {
                  setSearchUsers([])
                }}>
                <div className="search-results-wrapper">
                  {searchUsers.map((u) => (
                    <Link key={u.fullname} to={`/profile/${u.username}`}>
                    <div key={u.username} className="search-results-user">
                      <img className="online-friend-img" src={u.profilePicture} alt="" />
                      <span>{u.fullname}</span>
                    </div>
                    </Link>
                  ))}
                </div>
                </OutsideClickHandler>
              </div>
            }
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <span className="logout" onClick={handleLogout}>Log out</span>  
            <Link to="/messenger">
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge  color="secondary">
                <ChatIcon />
              </Badge>
            </IconButton>
            </Link>
            <IconButton aria-label="notification" color="inherit">
              <Badge badgeContent={redDot ? 1 : 0} color="secondary">
                <NotificationsIcon onClick={handleNotification}/>
              </Badge>
            </IconButton>
            {notificationIsOpen && 
              <div className="notifications">
              <OutsideClickHandler
                onOutsideClick={() => {
                  setNotificationIsOpen(false)
                  setRedDot(false)
                }}>
              <div className="notifications-wrapper">
              {notifications.length > 0 ? notifications.map(n => (
                <div key={n.fullname} className="notification">
                  <p><span className="notification-name">{n.fullname}</span> followed you</p>
                  <span className="created-at">{format(n.createdAt)}</span>
                </div>
              )) : <div className="no-notifications">No notifications</div>}
              </div>
              </OutsideClickHandler>  
            </div>
            }
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
            >
            <Link to={`/profile/${props.user.username}`}>
              <img className="navbar-profile-picture" src={props.user.profilePicture} alt="" />
            </Link>  
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <List>
            <img style={{objectFit: "cover",width: "100%", borderRadius: "15px"}} src="https://firebasestorage.googleapis.com/v0/b/damirsbook.appspot.com/o/folder%2Fad.jpg?alt=media&token=6c44cb16-86be-460b-b7c6-0f557bf47b1a" alt="" />
        </List>

        <List className="navbar-followings">
          <div className="left-sidebar-friends">People you follow</div>
          {
            followings.length > 0 ? followings.map(f => (
              <Link key={f.fullname} to={`/profile/${f.username}`}>
                <Online isOnline={false} friend={f} key={f.username}/>
              </Link>
            )) : <span>You don't follow anyone yet</span>
          }
        </List>
        <List>
          <div className="right-sidebar-onlinefriends navbar-onlinefriends">
            <span>Online friends</span>

            {onlineFriends.length > 0 ? onlineFriends.map(f => (
              <Link key={f.fullname} to={`/profile/${f.username}`}>
                <Online isOnline={true} friend={f} key={f.username} />
              </Link>
              )) : <div style={{marginTop: "10px"}}>No online friends</div>}
          </div>
        </List>
      </Drawer>

      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

PrimarySearchAppBar.propTypes = {
  logout: PropTypes.func.isRequired,
}

export default connect(null, {logout})(PrimarySearchAppBar);
