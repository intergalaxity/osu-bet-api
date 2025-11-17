import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await client.connect();
      const database = client.db('osubet');
      const users = database.collection('users');
      
      const allUsers = await users.find({}).toArray();
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
