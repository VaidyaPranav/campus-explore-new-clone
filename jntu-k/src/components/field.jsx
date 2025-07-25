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
        const response = await axios.get("http://localhost:3002/posts");
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
                <h2 className="name">{post.name}</h2>
                <p className="name">{post.user_email}</p>
               
              </div>
            </div>
            <div className="post-content">
              <p>{post.content}</p>

            
              {post.media_url && (
                <img
                  className="certificate-img"
                  src={post.media_url}
                  alt="Uploaded Certificate"
                  style={{ maxWidth: "70%", height: "auto", marginTop: "10px" }}
                />
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
