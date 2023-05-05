import { TextLists } from '../../models/TravelLog/TextLists';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'POST':
      let bodyObject = JSON.parse(req.body);
      TextLists.createIndex({ number: 1 }, { unique: true });
      let email = await TextLists.insertOne(bodyObject);
      res.json(email);
      break;
    case 'GET':
      const allText = await TextLists.find({}).toArray();
      res.json({ status: 200, data: allText });
      break;
  }
}
