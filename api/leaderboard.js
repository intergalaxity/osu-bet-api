import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const users = await client.get('users');
      await client.disconnect();
      
      res.status(200).json(users ? JSON.parse(users) : []);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
