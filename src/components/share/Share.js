import React, {useState, useRef} from 'react';
import "./Share.css";
import axios from "axios";
import firebase  from "../../firebase/index";
import Picker, { SKIN_TONE_NEUTRAL } from 'emoji-picker-react';

import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel
} from "@material-ui/icons";


export default function Share(props) {

  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [img, setImg] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const ref = useRef(null);

  const onEmojiClick = (event, emojiObject) => {
    const cursor = ref.current.selectionStart;
    const text = desc.slice(0, cursor) + emojiObject.emoji + desc.slice(cursor);
    setDesc(text);
  };

  const handleEmojiOpen = () => {
    setEmojiOpen(!emojiOpen);
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();

    const newPost = {
      userId: props.user._id,
      desc: desc
    }
    

    try {
        if(file || (file && desc.length > 0)){
          const storage = firebase.storage();
          const storageRef = storage.ref();
          const uploadTask = storageRef.child('folder/' + file.name).put(file);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) =>{
            },(error) =>{
              throw error
            },() =>{
        
              uploadTask.snapshot.ref.getDownloadURL().then((url) =>{
                newPost.img = url
                axios.post("https://damirsbook.herokuapp.com/api/posts/", newPost)
                  .then(res => {
                    console.log(res.data);
                    props.increasePosts();
                    setDesc("");
                    setFile(null);
                  })
                  .catch(err => console.log(err.message));
              })
           }
         )
        } else if (desc.length > 0) {

        const postic = await axios.post("https://damirsbook.herokuapp.com/api/posts/", newPost);
        props.increasePosts();
        setDesc("");
        setFile(null);
        }
    } catch (err) {}
  }

  const handleCancel = () =>{
    setFile(null);
    document.querySelector('form').reset();
  }

  return (
    <div className="share">
      <div className="share-wrapper">
        <div className="share-top">
          <img className="share-profile-picture" src={props.user.profilePicture} alt="profilePicture" />
          <input type="text" id="text" ref={ref} name="desc" value={desc} onChange={(e)=>setDesc(e.target.value)} placeholder={"What's on your mind " + props.user.username + "?"} />
        </div>
        <hr />
        {file && 
          <div className="share-img-container">
            <img className="share-img" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="share-img-cancel" htmlColor="white" onClick={handleCancel}/>
          </div>
        }
        <form onSubmit={handleSubmit} className="share-bottom">
          <label htmlFor="file" className="share-item">
            <div className="share-item-icon">
              <PermMedia className="share-item-icons" htmlColor="red"/>
            </div>
            <span className="share-item-text">
              Photo
            </span>
            <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
          </label>
          <div className="share-item">
            <div className="share-item-icon" >
              <Label className="share-item-icons" style={{cursor: "initial"}} htmlColor="gray" />
            </div>
            <span className="share-item-text" style={{cursor: "initial"}}>
              Tag
            </span>
          </div>
          <div className="share-item">
            <div className="share-item-icon">
              <Room className="share-item-icons" style={{cursor: "initial"}} htmlColor="blue"/>
            </div>
            <span className="share-item-text" style={{cursor: "initial"}}>
              Location
            </span>
          </div>
          <div className="share-item emojiItem">
            <div className="share-item-icon">
            <EmojiEmotions className="share-item-icons" htmlColor="yellow" onClick={handleEmojiOpen}/>
            </div>
            <span className="share-item-text" onClick={handleEmojiOpen}>
              Feelings
            </span>
          </div>
          <button type="submit" className="btn btn-success" disabled={!desc && !file}>Share</button>
        </form>
        {emojiOpen && <Picker onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_NEUTRAL} className="emojiPicker"/>}
      </div>
    </div>
  )
}
