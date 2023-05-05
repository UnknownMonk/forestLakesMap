import db from '@/db';
import { WithId } from 'mongodb';

import { TextListLogEntryWithId } from './TextList';

export { TextListLogEntryWithId };

export type TextListsWithObjectId = WithId<TextListLogEntryWithId>;

export const TextLists = db.collection<TextListLogEntryWithId>('phone');
