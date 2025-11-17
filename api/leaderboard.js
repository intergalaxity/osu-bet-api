import { createClient } from 'redis';

// Create client outside handler (reused between requests)
const client = createClient({
  url: process.env.REDIS_URL
});

// Connect once
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const users = await client.get('users');
      res.status(200).json(users ? JSON.parse(users) : []);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
