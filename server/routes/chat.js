const express = require("express");

router.get("/", (req, res) => {
  res.send("Chat route working");
});
const router = express.Router();
const jwt = require("jsonwebtoken");
const Chat = require("../models/chat");
const Message = require("../models/message");

// Middleware to authenticate
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

router.post("/send", authenticate, async (req, res) => {
  try {
    const { recipientId, text } = req.body;

    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, recipientId] },
    });

    if (!chat) {
      chat = new Chat({ participants: [req.user.id, recipientId] });
      await chat.save();
    }

    const message = new Message({
      chat: chat._id,
      sender: req.user.id,
      recipient: recipientId,
      text,
    });

    await message.save();

    res.status(201).json({ chatId: chat._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔵 Get user’s chats
router.get("/", authenticate, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id,
    }).populate("participants", "username");

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:chatId", authenticate, async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    }).populate("sender", "username");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

module.exports = router;
