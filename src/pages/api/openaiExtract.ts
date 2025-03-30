import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (!openaiApiKey) {
    throw new Error('OpenAI API key is not defined');
  }

  const emailData = req.body.emailData;

  const messages = [
    { role: 'system', content: 'You are a financial assistant. You will be given an investor update email with financial data. Your job is to extract the financial data from the email and return it in a JSON format like {"cashOnHand": 100000, "monthlyRevenue": 100000, "cashBurn": 100000}. Only return the JSON, do not include any other text or comments.' },
    { role: 'user', content: `Search for the "Cash on Hand", "Monthly Revenue", and "Cash Burn" in the email. Here is the email: ${emailData}` },
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