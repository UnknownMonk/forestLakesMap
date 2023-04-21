import { z } from 'zod';
// import isValidDate from "date-fns/isValid";

const errors = {
  name: 'Name cannot be empty.',
  email: 'Must be valid email',
};

const baseValidation = z.object({
  email: z.string().email().trim().min(10, errors.email),
});

export const EmailListLogEntryWithId = baseValidation.extend({
  _id: z.string(),
});

export type EmailListLogEntryWithId = z.infer<typeof EmailListLogEntryWithId>;
