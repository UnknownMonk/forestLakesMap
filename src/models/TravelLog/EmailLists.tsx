import db from '@/db';
import { WithId } from 'mongodb';

import { EmailListLogEntryWithId } from './EmailList';

export { EmailListLogEntryWithId };

export type EmailListsWithObjectId = WithId<EmailListLogEntryWithId>;

export const EmailLists = db.collection<EmailListLogEntryWithId>('emails');
