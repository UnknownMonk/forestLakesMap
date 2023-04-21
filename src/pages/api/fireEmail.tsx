const sgMail = require('@sendgrid/mail');
import type { NextApiRequest, NextApiResponse } from 'next';

const { NEXT_PUBLIC_SEND_GRID_API_KEY, FROM_EMAIL } = process.env;

sgMail.setApiKey(NEXT_PUBLIC_SEND_GRID_API_KEY);
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.body;
  console.log(email, 'mails');

  const msg = {
    to: email,
    from: FROM_EMAIL,
    subject: '🔥🔥🔥FIRE!!🔥🔥🔥',
    html: `<p><strong> Forest Lakes Park Resident</strong></p><p><strong>A Fire has been reported in the area please visit the Forest Lakes Park Activity Tracker Website</strong> <a href="https://forest-lakes-map.vercel.app/">Click here to go to the website<a/></p>`,
  };

  await sgMail.send(msg);
  res.json({ success: true });
}
