import { z } from 'zod';
// import isValidDate from "date-fns/isValid";

const errors = {
  number: 'Not enough numbers.',
  numberMax: 'Too many numbers.',
};

const baseValidation = z.object({
  number: z.coerce.number().min(9, errors.number).max(9, errors.numberMax),
});

export const TextListLogEntryWithId = baseValidation.extend({
  _id: z.string(),
});

export type TextListLogEntryWithId = z.infer<typeof TextListLogEntryWithId>;
