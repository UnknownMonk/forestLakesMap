import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Missing DB_URL in .env.local');
}

if (!process.env.DB_NAME) {
  throw new Error('Missing DB_NAME in .env.local');
}

const client = new MongoClient(process.env.MONGODB_URI, {
  connectTimeoutMS: 300000, // 30 seconds
});
client.connect();
export default client.db(process.env.DB_NAME);
