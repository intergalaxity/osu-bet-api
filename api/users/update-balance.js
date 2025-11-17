import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      await client.connect();
      const database = client.db('osubet');
      const users = database.collection('users');
      
      const { username, balance } = req.body;
      
      const result = await users.updateOne(
        { username },
        { $set: { balance } }
      );
      
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update balance' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
