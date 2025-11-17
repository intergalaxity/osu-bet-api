import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL
});

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { username, balance } = req.body;
      
      await client.connect();
      const usersData = await client.get('users');
      let users = usersData ? JSON.parse(usersData) : [];
      
      const userIndex = users.findIndex(u => u.username === username);
      if (userIndex !== -1) {
        users[userIndex].balance = balance;
        await client.set('users', JSON.stringify(users));
        await client.disconnect();
        res.status(200).json({ success: true });
      } else {
        await client.disconnect();
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update balance' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
