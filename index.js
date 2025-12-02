// index.js メインファイル

// .env使用
require('dotenv').config();

const express = require('express');
const app = express();

// RenderはPORT環境変数でポートを渡す :contentReference[oaicite:3]{index=3}
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Render + Express');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
