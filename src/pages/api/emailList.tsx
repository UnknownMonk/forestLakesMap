import { EmailLists } from '@/models/TravelLog/EmailLists';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      let bodyObject = JSON.parse(req.body);
      EmailLists.createIndex({ email: 1 }, { unique: true });
      let email = await EmailLists.insertOne(bodyObject);
      res.json(email);
      break;
    case 'GET':
      const allEmails = await EmailLists.find({}).toArray();
      res.json({ status: 200, data: allEmails });
      break;
  }
}
