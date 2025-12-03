// index.js メインファイル

// .env使用
require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());


// URL指定
app.post("/api/chat", async (req, res) => {
  const message = req.body.message;
  res.json({ reply: "あなたの送ったメッセージ：" + message });
});


// RenderはPORT環境変数でポートを渡す :contentReference[oaicite:3]{index=3}
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server Running on " + PORT);
});
