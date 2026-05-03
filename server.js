const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize OpenAI (Note: Set OPENAI_API_KEY environment variable)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint to get AI suggestions for task prioritization
app.post('/api/suggest-schedule', async (req, res) => {
  try {
    const { tasks } = req.body;
    const prompt = `Given these tasks: ${JSON.stringify(tasks)}, suggest an optimal order to complete them based on priority, deadlines, and dependencies. Provide a numbered list with brief reasoning.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    const suggestion = response.choices[0].message.content;
    res.json({ suggestion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get AI suggestion' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});