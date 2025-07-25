import "../App.css";
import React, { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom';
 
const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setrole] = useState('');
  const [department, setdepartment] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usersResponse = await fetch('http://localhost:3002/hod');
      const users = await usersResponse.json();
console.log()
       
              const userExists = users.some(
           user =>
          user.name === name &&
          user.email === email &&
          user.password === password &&
          user.role === role &&
          user.department === department
         );

      if (!userExists) {
        alert("Name, email, or password is incorrect");
        return;
      }

      alert("Login successful!");

  

      navigate('/JNTUHUCEJ', {
  state: {
    name: name,
    email: email,
    role: role,
    department:department,
  },
});
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  return (<>
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
          <form className="search-form ms-4" role="search" style={{ maxWidth: 250, width: '100%' }}>
            
          </form>
        </div>
      </header>

    <div style={{background: "linear-gradient(90deg, #e3f2fd 0%, #fff 100%)",
    boxShadow:" 0 2px 16px rgba(156, 0, 204, 0.08)"}} className="containers" id="/signin">
      <div className="logo"></div>
      <div className="registration-form">
        <h2>Login for HOD</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="role">role</label>
          <input
            type="text"
            id="role"
            name="role"
            required
            placeholder="dont use caps"
            value={role}
            onChange={(e) => setrole(e.target.value)}
          />
          <label htmlFor="dept">Department</label>
          <input
            type="text"
            id="dept"
            name="dept"
            required
            placeholder="use caps"
            value={department}
            onChange={(e) => setdepartment(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
<label htmlFor="password">password</label>
           <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingRight: "10px" }}
            />
    
          <button type="submit" className="register-btn"  >
            Login
          </button>
          
        </form>
      </div>
      <footer>
        <a href="#">Conditions of Use</a> | <a href="#">Privacy Notice</a> |{' '}
        <a href="#">Help</a>
        <p>@JNRUHUCEJ. All rights reserved.</p>
      </footer>
    </div></>
  );
};

export default Login;