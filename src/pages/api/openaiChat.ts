import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OpenAI API key is not defined');
  }

  const prompt = req.body.prompt;
  const financialData = req.body.financialData;

  const messages = [
    { role: 'system', content: 'You are a financial assistant. If you do not know how to respond or are asked about something irrelevant to the financial data, respond with "I do not know how to respond to that. Ask me something about your data instead 😊"' },
    { role: 'user', content: `Here is the current financial data: ${JSON.stringify(financialData)}` },
    { role: 'user', content: prompt }
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );
    res.status(200).json({ message: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: `Failed to get response from OpenAI: ${error}` });
  }
} 