// index.js メインファイル

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

// RenderはPORT環境変数でポートを渡す
const port = process.env.PORT || 10000;

// OpenAI クライアント(Render の Environment Variables に設定)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


app.use(cors());
app.use(express.json());




// ヘルパー: モデルからドル円レートを取得
async function fetchUsdJpyRate() {
	
	// OpenAI Responses API を使用
	const response = await client.responses.create({
		
		model: "gpt-4.1-mini",
		input:
			"あなたは為替レートAPIです。最新のドル円（USD/JPY）の為替レートをネット検索で調べて、" +
			"小数第2位までの数値だけを出力してください。例: 155.23 のようにしてください。" +
			"他の文字や説明、単位は一切出力しないでください。",
		tools: [
			{
				type: "web_search", // Web検索ツールを有効にする
			},
		],
	});
	
	// SDK の output_text ヘルパーでテキストを取得（公式ドキュメントより）
	const text = response.output_text?.trim?.() ?? "";
	
	// "155.23" のような文字列を数値化
	const rate = parseFloat(text);
	
	if (!Number.isFinite(rate)) {
		// 想定外の形式の場合はそのまま raw を返してエラー扱いにする
		throw new Error(`為替レートを数値として解釈できません: "${text}"`);
	}
	
	return { rate, raw: text };
}


// API エンドポイント: /api/rate
app.post("/api/rate", async (req, res) => {
	try {
		const result = await fetchUsdJpyRate();
		res.json({
			success: true,
			rate: result.rate,
			raw: result.raw, // デバッグ用
		});
	} catch (err) {
		console.error("Error in /api/rate:", err);
		res.status(500).json({
			success: false,
			error: err.message || "Internal Server Error",
		});
	}
});




// シンプルな疎通確認用
app.get("/", (req, res) => {
	res.send("Render OpenAI USD/JPY rate backend is running.");
});




app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

