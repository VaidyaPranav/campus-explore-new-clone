import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../server.js"; // since you already export pool from server.js

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // ✅ Verify token using Google OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    // ✅ Check MySQL for existing user
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "This Gmail is not registered with us." });
    }

    const user = rows[0];

    // ✅ Create JWT token
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: jwtToken,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
};
