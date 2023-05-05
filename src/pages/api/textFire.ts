import type { NextApiRequest, NextApiResponse } from 'next';
import carriers from '@/lib/carriers.js';
// import providers from "@/lib/providers"
import text from '@/lib/text';
type Data = {
  name: string;
};

function stripPhone(phone: any) {
  return `${phone}`.replace(/\D/g, '');
}

function textRequestHandler(
  req: any,
  res: any,
  number: any,
  carrier: any,
  region: any
) {
  if (!number || !req.body.message) {
    res.send({
      success: false,
      message: 'Number and message parameters are required.',
    });
    return;
  }

  let carrierKey = null;
  if (carrier) {
    carrierKey = carrier.toLowerCase();
    // const carriers: { [key: string]: string[] } = {};
    if (carriers[carrierKey] == null) {
      res.send({
        success: false,
        message:
          `Carrier ${carrier} not supported! POST getcarriers=1 to ` +
          'get a list of supported carriers',
      });
      return;
    }
  }

  let { message } = req.body;
  if (message.indexOf(':') > -1) {
    // Handle problem with vtext where message would not get sent properly if it
    // contains a colon.
    message = ` ${message}`;
  }

  // Time to actually send the message
  text.send(number, message, carrierKey, region, (err: any) => {
    if (err) {
      res.send({
        success: false,
        message: `Communication with SMS gateway failed. Did you configure mail transport in lib/config.js?  Error message: '${err.message}'`,
      });
    } else {
      res.send({ success: true });
    }
  });
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'POST') {
    if (
      req.body.getcarriers != null &&
      (req.body.getcarriers === '1' ||
        req.body.getcarriers.toLowerCase() === 'true')
    ) {
      res.send({ success: true, carriers: Object.keys(carriers).sort() });
      return;
    }
    const number = stripPhone(req.body.number);
    if (number.length < 9 || number.length > 10) {
      res.send({ success: false, message: 'Invalid phone number.' });
      return;
    }
    textRequestHandler(req, res, number, req.body.carrier, 'us');
    // Process a POST request
  } else {
    // Handle any other HTTP method
    res.status(200).json({ name: 'John Doe' });
  }
}
