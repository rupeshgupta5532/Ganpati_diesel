const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@cluster0.p1b5f.mongodb.net/ganpati?retryWrites=true&w=majority&appName=Cluster0';
(async function() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('ganpati');
  const users = await db.collection('users').find({}).toArray();
  users.forEach(u => console.log(u.email, '->', u.role));
  process.exit(0);
})();
