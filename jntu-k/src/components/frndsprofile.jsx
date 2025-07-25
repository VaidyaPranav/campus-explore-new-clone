import Header from "./header";
import Footer from "./footer";
import "../App.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
let Frndsprofile = () => {

   
const { email } = useParams();
  const [posts, setPosts] = useState([]);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const { name, role ,department } = location.state || {};
  console.log(name,role,department);
console.log(email);
 useEffect(() => {
  const fetchUserPosts = async () => {
    try {



      const res = await axios.get(`http://localhost:3002/posts?user_email=${email}`)
      console.log("Posts fetched for:", email, res.data);
      setPosts(res.data);
      if (res.data.length > 0) {
        setUserName(res.data[0].name);
      }
    } catch (err) {
      console.error("Error loading user posts", err);
    }
  };

  fetchUserPosts();
}, [email]);


    return <>
    <Header />
      <div className="profile-container">
        {/* <div className="profile-header">
          <img src="/pranav.png" alt="Profile" className="profile-avatar" />
          <div className="profile-info">
            <h2>{name}</h2>
            <h4>{department}</h4>
            <div className="profile-stats">
              <span>
                <strong>{posts.length}</strong> posts
              </span>
            </div>

          </div>
        </div> */}

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
           
          </div>
        ))}
      </div>
      </div>
      <Footer />
    </>
}
export default Frndsprofile;