import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, country_code, avatar_url, balance = 0 } = req.body;
      
      await client.connect();
      const usersData = await client.get('users');
      let users = usersData ? JSON.parse(usersData) : [];
      
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        await client.disconnect();
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
      await client.disconnect();
      
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
