import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await client.connect();
      const database = client.db('osubet');
      const users = database.collection('users');
      
      const { username, country_code, avatar_url, balance = 0 } = req.body;
      
      // Check if user exists
      const existingUser = await users.findOne({ username });
      if (existingUser) {
        return res.status(200).json(existingUser);
      }
      
      // Create new user
      const newUser = {
        username,
        country_code,
        avatar_url,
        balance,
        questions: 0,
        wins: 0,
        winrate: 0,
        createdAt: new Date()
      };
      
      const result = await users.insertOne(newUser);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to register user' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
