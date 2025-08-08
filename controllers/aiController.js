const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();

exports.askAI = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
           messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000", // change this to your actual site URL
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ message: "AI error",       
        error: error.response?.data || error.message
 });
  }
};
