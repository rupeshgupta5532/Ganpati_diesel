import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/ganpati_diesel';

async function deleteUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');
    
    // The collection name is usually 'users' (lowercase, pluralized from User)
    const db = mongoose.connection.db;
    const result = await db.collection('users').deleteMany({});
    
    console.log(`Successfully deleted ${result.deletedCount} users.`);
  } catch (error) {
    console.error('Error deleting users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

deleteUsers();
