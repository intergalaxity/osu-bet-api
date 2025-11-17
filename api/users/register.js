import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', err => console.log('Redis Client Error', err));
await client.connect();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, country_code, avatar_url, balance = 0 } = req.body;
      
      const usersData = await client.get('users');
      let users = usersData ? JSON.parse(usersData) : [];
      
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        return res.status(200).json(existingUser);
      }
      
      const newUser = {
        username,
        country_code,
        avatar_url,
        balance,
        questions: 0,
        wins: 0,
        winrate: 0
      };
      
      users.push(newUser);
      await client.set('users', JSON.stringify(users));
      
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
