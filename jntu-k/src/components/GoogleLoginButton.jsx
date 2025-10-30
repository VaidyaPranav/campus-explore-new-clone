// import { useEffect } from "react";
// import jwtDecode from "jwt-decode";

// const GoogleLoginButton = () => {
//   useEffect(() => {
//     /* global google */
//     if (window.google) {
//       google.accounts.id.initialize({
//         client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
//         callback: handleCredentialResponse,
//       });

//       google.accounts.id.renderButton(
//         document.getElementById("google-login-btn"),
//         { theme: "outline", size: "large", text: "signin_with" } // customize
//       );
//     }
//   }, []);

//   const handleCredentialResponse = async (response) => {
//     const token = response.credential;

//     // Decode to show basic user info (optional)
//     const user = jwtDecode(token);
//     console.log("Decoded user:", user);

//     try {
//       // Send token to backend for verification
//       const res = await fetch("http://localhost:3002/api/auth/google-login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token }),
//       });

//       const data = await res.json();
//       if (data.success) {
//         localStorage.setItem("token", data.token);
//         alert("✅ Login successful!");
//         console.log("Logged-in user:", data.user);
//       } else {
//         alert(data.message || "Login failed");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       alert("Something went wrong during login");
//     }
//   };

//   return <div id="google-login-btn"></div>;
// };

// export default GoogleLoginButton;
