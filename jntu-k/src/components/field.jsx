import Header from "./header";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./footer";
import "../App.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

let Field = () => {
  const location = useLocation();
  const { name, email, role, department } = location.state || {};

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
  const response = await axios.get("https://campus-explore-portal.onrender.com/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Header userName={name} userEmail={email} userRole={role} department={department} />

      <div className="hi">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-header">
              <div className="profile-pic">
               
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Default Profile"
                />
              </div>
              <div className="profile-info">
                <h2 className="name">{post.name} </h2>
               
                

                
               
              </div>
            </div>
            <div className="post-content">
              <p>{post.content}</p>

{post.media_url && (
  post.media_url.endsWith(".mp4") || post.media_url.includes("video/upload") ? (
    <video
      controls
      className="certificate-video"
      style={{ maxWidth: "70%", height: "auto", marginTop: "10px" }}
    >
      <source src={post.media_url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  ) : (
    <img
      className="certificate-img"
      src={post.media_url}
      alt="Uploaded Certificate"
      style={{ maxWidth: "70%", height: "auto", marginTop: "10px" }}
    />
  )
)}

              
            </div>
            <div className="post-actions">
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Field;
