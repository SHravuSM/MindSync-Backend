const express = require("express");
const User = require("../models/User");
const { getAuth } = require("firebase-admin/auth");
const router = express.Router();

router.get("/user", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const decoded = await getAuth().verifyIdToken(token);

    const user = await User.findOne({ uid: decoded.uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const token = req.body.token;
    const decoded = await getAuth().verifyIdToken(token);

    let user = await User.findOne({ uid: decoded.uid });
    if (!user) {
      user = await User.create({
        uid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        role: "user",
        photo: decoded.picture,
      });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// router.post("/registeradmin", async (req, res) => {
//   try {
//     const token = req.body.token;
//     const decoded = await getAuth().verifyIdToken(token);

//     let user = await User.findOne({
//       uid: decoded.uid,
//       name: decoded.name,
//       email: decoded.email,
//     });
//     if (!user) {
//       user = await User.create({
//         uid: decoded.uid,
//         name: decoded.name,
//         email: decoded.email,
//         role: "admin",
//         photo: decoded.picture,
//       });
//     }
//     console.log(user);
//     res.json({ user });
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ error: "Invalid token" });
//   }
// });

module.exports = router;
