const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// 🟢 Get all conversations of a user
router.get("/", authenticate, async (req, res) => {
  const chats = await Chat.find({ members: req.user.id }).populate("members", "username");
  res.json(chats);
});

// 🟡 Get messages of a chat
router.get("/:chatId", authenticate, async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "username");
  res.json(messages);
});

// 🔵 Send message (create chat if doesn't exist)
router.post("/send", authenticate, async (req, res) => {
  const { recipientId, text } = req.body;

  let chat = await Chat.findOne({
    members: { $all: [req.user.id, recipientId] },
  });

  if (!chat) {
    chat = new Chat({ members: [req.user.id, recipientId] });
    await chat.save();
  }

  const message = new Message({
    chat: chat._id,
    sender: req.user.id,
    text,
  });

  await message.save();

  chat.lastMessage = text;
  await chat.save();

  res.status(201).json(message);
});

module.exports = router;
