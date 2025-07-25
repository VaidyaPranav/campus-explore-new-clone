import Header from "./header";
import Footer from "./footer";
import { useLocation, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

let Profile = () => {
  const location = useLocation();
  const { name, email, role, department } = location.state || {};
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!email) return;

    axios
      .get("http://localhost:3002/posts")  
      .then((res) => {
         
        const userPosts = res.data.filter((post) => post.user_email === email);
        setPosts(userPosts);
      })
      .catch((err) => console.error("❌ Error fetching posts:", err));
  }, [email]);

  return (
    <>
      <Header />
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
         <div className="profile-pic">
                {/* You can use a placeholder or initials for profile image */}
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Default Profile"
                />
              </div>
          <div className="profile-info">
            <h2>{name}</h2>
            <h4>{department}</h4>
            <div className="profile-stats">
              <span>
                <strong>{posts.length}</strong> posts
              </span>
            </div>
           
          </div>
        </div>

        {/* Post Grid */}
        <div className="hi">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            <div className="post-header">
              <div className="profile-pic">
                {/* You can use a placeholder or initials for profile image */}
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
  );
};

export default Profile;
