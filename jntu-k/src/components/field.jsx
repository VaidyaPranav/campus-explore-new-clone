import Header from "./header";
import { useLocation } from "react-router-dom";
import Footer from "./footer";
import "../App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

let Field = () => {
  const location = useLocation();
  const { name, email, role, department } = location.state || {};

  const [posts, setPosts] = useState([]);
  const [likesData, setLikesData] = useState({});
  const [userLikes, setUserLikes] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});

  // 🧠 Fetch posts + likes + comments
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("https://campus-explore-portal.onrender.com/posts");
        const postsData = response.data;
        setPosts(postsData);

        const likesObj = {};
        const commentsObj = {};

        // fetch likes and comments for each post
        for (const post of postsData) {
          const likesRes = await axios.get(
            `https://campus-explore-portal.onrender.com/likes/${post.id}`
          );
          const commentsRes = await axios.get(
            `https://campus-explore-portal.onrender.com/comments/${post.id}`
          );
          likesObj[post.id] = likesRes.data.totalLikes || 0;
          commentsObj[post.id] = commentsRes.data || [];
        }

        setLikesData(likesObj);
        setCommentsData(commentsObj);
      } catch (error) {
        console.error("❌ Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // ❤️ Like / Unlike a post (using your backend /likes/toggle)
  const handleLike = async (postId) => {
    try {
      const response = await axios.post("https://campus-explore-portal.onrender.com/likes/toggle", {
        post_id: postId,
        user_email: email,
      });

      const { liked } = response.data;

      // Update like count and user like state
      setUserLikes((prev) => ({ ...prev, [postId]: liked }));
      setLikesData((prev) => ({
        ...prev,
        [postId]: liked
          ? (prev[postId] || 0) + 1
          : Math.max((prev[postId] || 1) - 1, 0),
      }));
    } catch (error) {
      console.error("❌ Failed to toggle like:", error);
    }
  };

  // 💬 Add comment
  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;

    try {


      setCommentText((prev) => ({ ...prev, [postId]: "" }));

      const commentsRes = await axios.get(
        `https://campus-explore-portal.onrender.com/comments/${postId}`
      );
      setCommentsData((prev) => ({ ...prev, [postId]: commentsRes.data }));
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  // 🧭 Toggle comment section
  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <>
      <Header
        userName={name}
        userEmail={email}
        userRole={role}
        department={department}
      />

      <div className="hi">
        {posts.map((post) => (
          <div className="post-card" key={post.id}>
            {/* Post Header */}
            <div className="post-header">
              <div className="profile-pic">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Default Profile"
                />
              </div>
              <div className="profile-info">
                <h2 className="name">{post.name}</h2>
                <p style={{ color: "#888", fontSize: "0.9rem" }}>
                  {post.created_at
                    ? new Date(post.created_at).toLocaleString()
                    : ""}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <div className="post-content">
                <p>{post.content}</p>
                {post.media_url && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {post.media_url.endsWith(".mp4") ||
                  post.media_url.includes("video/upload") ? (
                    <video
                      controls
                      className="certificate-video"
                      style={{
                        maxWidth: "100%",
                        height: "370px",
                        margin: "0 auto",
                        borderRadius: "10px",
                        display: "block",
                      }}
                    >
                      <source src={post.media_url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      className="certificate-img"
                      src={post.media_url}
                      alt="Uploaded Certificate"
                      style={{
                        maxWidth: "100%",
                        height: "75%",
                        minHeight:"400px",
                        margin: "0 auto",
                        borderRadius: "10px",
                        display: "block",
                      }}
                    />
                  )}
                </div>
              )}
              </div>

            {/* Post Actions */}
            <div
              className="post-actions"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginTop: "10px",
              }}
            >
              <button
                onClick={() => handleLike(post.id)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  color: userLikes[post.id] ? "red" : "gray",
                }}
              >
                ❤️ {likesData[post.id] || 0}
              </button>

              <button
                onClick={() => toggleComments(post.id)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "#007bff",
                }}
              >
                💬 {commentsData[post.id]?.length || 0} Comments
              </button>
            </div>

            {/* Comment Section */}
            {showComments[post.id] && (
              <div
                className="comments-section"
                 style={{
    marginTop: "15px",
    padding: "15px",
    background: "#f5f6fa",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxHeight: "300px",
    overflowY: "auto",
    position: "relative",
    zIndex: 2,
  }}
              >
                {commentsData[post.id]?.length > 0 ? (
                  commentsData[post.id].map((c) => (
                    <p key={c.id}>
                      <b>{c.name}</b> <small>{c.user_name}</small>:-{" "}
                      {c.comment_text}
                    </p>
                  ))
                ) : (
                  <p style={{ color: "#666" }}>No comments yet.</p>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "10px",
                    gap: "5px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "20px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    style={{
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "20px",
                      cursor: "pointer",
                    }}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
};

export default Field;
