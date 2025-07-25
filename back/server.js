require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const port = 3002;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

app.use(cors());
app.use(bodyParser.json());

// MySQL Setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pranavvaishnav1817",
  database: "testdb",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.stack);
    return;
  }
  console.log("✅ Connected to database.");
});

// Routes
const uploadRoute = require("./routes/uploadRoute");
app.use("/api", uploadRoute);

app.get('/faculty', (_, res) => {
  db.query("SELECT * FROM users WHERE role = 'faculty'", (err, results) => {
    if (err) {
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results);
  });
});
app.get('/hod', (_, res) => {
  db.query("SELECT * FROM users WHERE role = 'hod' ", (err, results) => {
    if (err) {
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results);
  });
});

app.get('/students', (_, res) => {
  db.query("SELECT * FROM users WHERE role = 'student' ", (err, results) => {
    if (err) {
      res.status(500).send('Error fetching users');
      return;
    }
    res.json(results);
  });
});


app.get("/posts", (req, res) => {
  const { user_email } = req.query;

  let query = "SELECT * FROM posts";
  let params = [];

  if (user_email) {
    query += " WHERE user_email = ?";
    params.push(user_email);
  }

  query += " ORDER BY created_at DESC";

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});



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

app.get("/users", (req, res) => {
  const { department } = req.query;

  let query = "SELECT * FROM users";
  let values = [];

  if (department) {
    query += " WHERE department = ?";
    values.push(department);
  }

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Failed to fetch users:", err);
      return res.status(500).json({ error: "Failed to fetch users" });
    }
    res.json({ users: results });
  });
});
 
app.post("/posts", (req, res) => {
  const { name, user_email, content, media_url } = req.body;

  if (!user_email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    INSERT INTO posts (name, user_email, content, media_url)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [name, user_email, content, media_url], (err, result) => {
    if (err) {
      console.error("❌ Error inserting post:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(201).json({ message: "✅ Post created successfully", postId: result.insertId });
  });
});
 
app.use(express.static(path.join(__dirname, "../jntu-k/dist")));

app.get("/Livechat", (req, res) => {
  res.sendFile(path.join(__dirname, "../jntu-k/dist/index.html"));
});

app.get("/messages", (req, res) => {
  db.query("SELECT * FROM messages ORDER BY timestamp ASC", (err, results) => {
    if (err) return res.status(500).send("Error fetching messages");
    res.json(results);
  });
});

 
const users = {};

io.on("connection", (socket) => {
  console.log("🔗 New socket connected:", socket.id);

  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    console.log("👤 User joined:", name);
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("chat-message", (message) => {
    const senderId = socket.id;
    const senderName = users[senderId] || "Anonymous";

    socket.broadcast.emit("chat-message", {
      message,
      senderId,
      senderName,
    });

    
    db.query(
      "INSERT INTO messages (sender_id, message) VALUES (?, ?)",
      [senderId, message],
      (err, result) => {
        if (err) console.error("❌ Error saving message:", err);
        else console.log("💾 Message saved to DB");
      }
    );
  });

  socket.on("disconnect", () => {
    const name = users[socket.id] || "A user";
    console.log("❌ User disconnected:", name);
    socket.broadcast.emit("user-disconnected", name);
    delete users[socket.id];
  });
});

httpServer.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
