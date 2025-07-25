import React, { useState, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Friends() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selecteddepartment, setSelecteddepartment] = useState("IT");
  const location = useLocation();
  const { name, email , role ,department } = location.state || {};

  useEffect(() => {
   axios.get(`http://localhost:3002/users?department=${selecteddepartment}`)
      .then((res) => {
        setUsers(res.data.users);
        console.log(res.data.users);
      })
      
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, [selecteddepartment]);

  return (
    <>
      <Header />
      <div className="explore">
        <div className="role-buttons">
        {["IT", "EEE", "ECE", "ME", "CSE"].map((dept) => (
          <button
            key={dept}
            onClick={() => setSelecteddepartment(dept)}
            className={selecteddepartment === dept ? "active" : ""}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="user-cards">
        {users.map((user) => (
          
          <div key={user.id} className="user-card">
            <div className="profile-pic">
                 
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="Default Profile"
                />
              </div>
            <h3>{user.name}</h3>
            <h5>{user.role}</h5>
            <p>{user.department}</p>

<button
  onClick={() =>
    navigate(`/profile/${user.email}`, {
      state: {
        name: name,
        department:department,
        role: role,
      },
    })
  }
>
  View
</button>

         </div>
        ))}
      </div>
      </div>
      <Footer />
    </>
  );
}

export default Friends;
