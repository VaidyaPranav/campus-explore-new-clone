import Header from "./header";
import Footer from "./footer";
import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
function Addpost() {
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
  const location = useLocation();
const { name ,email, role  } = location.state || {}; 
console.log(email)
console.log(role);
  const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("media", selectedFile);  

  try {
    const uploadRes = await axios.post("http://localhost:3002/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const media_url = uploadRes.data.url;
 

    const res = await axios.post("http://localhost:3002/posts", {
      name,
      user_email: email,
      content,
      media_url,
    });

    alert("✅ Post uploaded!");
    setContent("");
    setSelectedFile(null);
  } catch (err) {
    console.error("❌ Failed to upload post:", err);
  }
};

  return (
    <>
    <Header></Header>
    <form onSubmit={handleSubmit} className="post-form">
  <div className="post-header">
    <img src="profile.jpg" alt="Profile" className="profile-img" />
    <div className="user-info">
      <p className="user-name">{name}</p>
      <p className="post-hint">Share your thoughts</p>
    </div>
  </div>

  <textarea
    placeholder="What's on your mind?"
    value={content}
    onChange={(e) => setContent(e.target.value)}
    required
    className="post-textarea"
  />

  <input
  type="file"
  accept="image/*,video/*"
  onChange={(e) => setSelectedFile(e.target.files[0])}
/>



  <button type="submit" className="post-btn">Post</button>
</form>
<Footer></Footer>
</>
  );
}

export default Addpost;
