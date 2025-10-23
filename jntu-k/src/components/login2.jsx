import "../App.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 👇 same structure as faculty — updated backend URL
      const res = await fetch("http://localhost:3002/students");
      const data = await res.json();

      console.log("Fetched students:", data);

      if (!Array.isArray(data) || data.length === 0) {
        alert("No student data found in backend!");
        return;
      }

      // normalize values to compare case-insensitively
      const normalize = (v) => (v ?? "").trim().toLowerCase();

      const foundUser = data.find((u) => {
        const uname = u.name || u.user_name || "";
        const uemail = u.email || u.user_email || "";
        const upass = u.password || u.passwords || "";
        const urole = u.role || "";
        const udept = u.department || u.dept || "";

        return (
          normalize(uname) === normalize(name) &&
          normalize(uemail) === normalize(email) &&
          upass.trim() === password.trim() &&
          normalize(urole) === normalize(role) &&
          normalize(udept) === normalize(department)
        );
      });

      console.log("Matched student user:", foundUser);

      if (!foundUser) {
        alert("Invalid name, email, password, role, or department!");
        return;
      }

      alert("Student login successful!");
      navigate("/JNTUHUCEJ", {
        state: {
          name: foundUser.name || foundUser.user_name,
          email: foundUser.email || foundUser.user_email,
          role: foundUser.role,
          department: foundUser.department || foundUser.dept,
        },
      });
    } catch (err) {
      console.error("Error:", err);
      alert("Server error! Please check backend or console.");
    }
  };

  return (
    <>
      <header className="custom-header py-4">
        <div className="container d-flex flex-wrap justify-content-center align-items-center">
          <a href="/" className="d-flex align-items-center me-lg-auto text-decoration-none flex-wrap">
            <img src="jntuhlogo1.png" alt="JNTU Logo" className="logo-img" />
            <span className="fs-4 ms-3">
              <div className="university-title fw-bold" style={{ color: 'rgb(156,0,204)', fontSize: '1.1rem' }}>
                JAWAHARLAL NEHRU TECHNOLOGICAL UNIVERSITY HYDERABAD
              </div>
              <div className="college-title" style={{ color: 'rgb(156,0,204)', fontWeight: 500 }}>
                UNIVERSITY COLLEGE OF ENGINEERING JAGTIAL (AUTONOMOUS)
              </div>
              <div className="address text-muted" style={{ fontSize: '0.95rem' }}>
                Nachupally (Kondagattu), Kodimial Mandal, Jagtial Dist. Telangana - 505 501
              </div>
            </span>
          </a>
        </div>
      </header>

      <div style={{ background: "linear-gradient(90deg, #e3f2fd 0%, #fff 100%)", boxShadow: "0 2px 16px rgba(156, 0, 204, 0.08)" }} className="containers">
        <div className="registration-form">
          <h2>Login for Student</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

            <label>Role</label>
            <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required placeholder="don't use caps" />

            <label>Department</label>
            <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required placeholder="use caps" />

            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <label>Password</label>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />

            <button type="submit" className="register-btn">Login</button>
          </form>
        </div>
        <footer>
          <p>@ JNTUHUCEJ All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default StudentLogin;
