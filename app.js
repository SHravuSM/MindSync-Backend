// app.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const admin = require("firebase-admin");
const postRoutes = require("./routes/postRoutes");
const Register = require("./routes/Register");
const Tag = require("./routes/tag");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Firebase config
const firebaseConfig = JSON.parse(
  Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, "base64").toString("utf-8")
);
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/", Register);
app.use("/tags", Tag);
app.use("/posts", postRoutes);

app.get("/", (req, res) => {
  return res.json({ message: "Hello" });
});

module.exports = app;