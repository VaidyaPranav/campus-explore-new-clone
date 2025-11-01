import Header from "./header";
import Footer from "./footer";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const Profile = () => {
  const location = useLocation();
  const { name, email, role, department } = location.state || {};
  const [posts, setPosts] = useState([]);
  const [likesData, setLikesData] = useState({});
  const [commentsData, setCommentsData] = useState({});
  const [showComments, setShowComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [userLikes, setUserLikes] = useState({});

  useEffect(() => {
    if (!email) return;
    const fetchUserPosts = async () => {
      try {
        const res = await axios.get("https://campus-explore-portal.onrender.com/posts");
        const userPosts = res.data.filter((post) => post.user_email === email);
        setPosts(userPosts);

        const likesObj = {};
        const commentsObj = {};

        for (const post of userPosts) {
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
      } catch (err) {
        console.error("❌ Error fetching posts:", err);
      }
    };

    fetchUserPosts();
  }, [email]);

  // ❤️ Like toggle
  const handleLike = async (postId) => {
    try {
      const response = await axios.post("https://campus-explore-portal.onrender.com/likes/toggle", {
        post_id: postId,
        user_email: email,
      });

      const { liked } = response.data;
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

  // 🗑️ Delete post
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`https://campus-explore-portal.onrender.com/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // 💬 Add comment
  const handleComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;
    try {
      await axios.post("https://campus-explore-portal.onrender.com/comments", {
        post_id: postId,
        user_email: email,
        comment_text: commentText[postId],
      });

      setCommentText((prev) => ({ ...prev, [postId]: "" }));

      const commentsRes = await axios.get(
        `https://campus-explore-portal.onrender.com/comments/${postId}`
      );
      setCommentsData((prev) => ({ ...prev, [postId]: commentsRes.data }));
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-pic">
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
                <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    marginLeft: "auto",
                  }}
                >
                  Delete
                </button>
              </div>

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
      </div>
      <Footer />
    </>
  );
};

export default Profile;
