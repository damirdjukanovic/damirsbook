import React from 'react';
import Share from "../share/Share";
import Post from "../post/Post";
import "./feed.css";
import axios from 'axios';
import {useState, useEffect} from 'react';

export default function Feed({username, user}) {

  const [posts, setPosts] = useState([]);
  const [postsLength, setPostsLength] = useState(0);
  const [randomCounter, setRandomCounter] = useState(1);


  function increasePosts(){
    setPostsLength(posts.length + 1);
  }

  useEffect(() => {
    const fetchPosts = async () =>{
      const res = username 
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("/posts/timeline/" + user?._id) 
      setPosts(res.data.sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      }));
    }
    fetchPosts();
  }, [username, user._id, randomCounter, postsLength]);

  function handleRandomCounter(){
    setRandomCounter(randomCounter+1)
  }

  return (
    <div className="feed">
      <div className="feed-wrapper">
      {(!username || username === user.username) && <Share user={user} increasePosts={increasePosts}/>}
        {posts.map((post) => {
          return <Post key={post._id} post={post} user={user} handleRandomCounter={handleRandomCounter}/>
        })}
        <p className="hide">{postsLength}</p>
      </div>
    </div>
  )
}
