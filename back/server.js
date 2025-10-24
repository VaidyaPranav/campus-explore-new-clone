const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config(); // load .env variables

const app = express();
const port = 3002;

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(bodyParser.json());

// ✅ Configure Cloudinary (real credentials)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Connect to MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "certs/ca.pem")),
  },
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Database connected!");
  }
});

// Export db and io if needed
module.exports = { db, io };


// Routes
const uploadRoute = require("./routes/uploadRoute");
app.use("/api", uploadRoute);

// Fetch users by role
app.get("/faculty", (_, res) => {
  db.query("SELECT * FROM users WHERE role = 'faculty'", (err, results) => {
    if (err) return res.status(500).send("Error fetching users");
    res.json(results);
  });
});
app.get("/hod", (_, res) => {
  db.query("SELECT * FROM users WHERE role = 'hod'", (err, results) => {
    if (err) return res.status(500).send("Error fetching users");
    res.json(results);
  });
});
app.get("/students", (_, res) => {
  db.query("SELECT * FROM users WHERE role = 'student'", (err, results) => {
    if (err) return res.status(500).send("Error fetching users");
    res.json(results);
  });
});

// Fetch posts
app.get("/posts", (req, res) => {
  const { user_email, name, department, role } = req.query;

  if (user_email) {
    const sql = `
      SELECT id, name, user_email, content, media_url, created_at
      FROM posts
      WHERE user_email = ?
      ORDER BY created_at DESC
    `;
    return db.query(sql, [user_email], (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      return res.json(rows);
    });
  }

  if (name || department || role) {
    const where = [];
    const params = [];
    if (name) { where.push("u.name = ?"); params.push(name); }
    if (department) { where.push("u.department = ?"); params.push(department); }
    if (role) { where.push("u.role = ?"); params.push(role); }

    const sql = `
      SELECT p.id, p.name, p.user_email, p.content, p.media_url, p.created_at
      FROM posts p
      INNER JOIN users u ON u.email = p.user_email
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY p.created_at DESC
    `;
    return db.query(sql, params, (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      return res.json(rows);
    });
  }

  const sql = `
    SELECT id, name, user_email, content, media_url, created_at
    FROM posts
    ORDER BY created_at DESC
  `;
  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json(rows);
  });
});

// Add user
app.post("/users", (req, res) => {
  const name = req.body.name || req.body.user_name;
  const email = req.body.email;
  const password = req.body.password;

  if (!name || !email || !password)
    return res.status(400).send("Missing required fields");

  db.query(
    "INSERT INTO users (user_name, email, passwords) VALUES (?, ?, ?)",
    [name, email, password],
    (err, result) => {
      if (err) return res.status(500).send("Error adding user");
      res.json({ message: "Authentication successful", user: { id: result.insertId, name, email, password } });
    }
  );
});

// Get users (optionally filter by department)
app.get("/users", (req, res) => {
  const { department } = req.query;
  let query = "SELECT * FROM users";
  const values = [];

  if (department) {
    query += " WHERE department = ?";
    values.push(department);
  }

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users" });
    res.json({ users: results });
  });
});

// Add post
app.post("/posts", (req, res) => {
  const { name, user_email, content, media_url } = req.body;

  if (!user_email) return res.status(400).json({ error: "Missing required fields" });

  const query = `
    INSERT INTO posts (name, user_email, content, media_url)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [name, user_email, content, media_url], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(201).json({ message: "✅ Post created successfully", postId: result.insertId });
  });
});

// Serve frontend
app.use(express.static(path.join(__dirname, "../jntu-k/dist")));
app.get("/Livechat", (req, res) => {
  res.sendFile(path.join(__dirname, "../jntu-k/dist/index.html"));
});

// Messages
app.get("/messages", (req, res) => {
  db.query("SELECT * FROM messages ORDER BY timestamp ASC", (err, results) => {
    if (err) return res.status(500).send("Error fetching messages");
    res.json(results);
  });
});

// Socket.io for chat
const users = {};
io.on("connection", (socket) => {
  console.log("🔗 New socket connected:", socket.id);

  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("chat-message", (message) => {
    const senderId = socket.id;
    const senderName = users[senderId] || "Anonymous";

    socket.broadcast.emit("chat-message", { message, senderId, senderName });

    db.query("INSERT INTO messages (sender_id, message) VALUES (?, ?)", [senderId, message], (err, result) => {
      if (err) console.error("❌ Error saving message:", err);
    });
  });

  socket.on("disconnect", () => {
    const name = users[socket.id] || "A user";
    socket.broadcast.emit("user-disconnected", name);
    delete users[socket.id];
  });
});

httpServer.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
