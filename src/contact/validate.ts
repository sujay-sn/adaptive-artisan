export interface ContactValues {
  name: string;
  email: string;
  message: string;
}

export type ContactField = keyof ContactValues;

export const CONTACT_FIELDS: readonly ContactField[] = ['name', 'email', 'message'];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Which fields need fixing before the message can go. */
export function contactProblems(values: ContactValues): Record<ContactField, boolean> {
  return {
    name: values.name.trim() === '',
    email: !EMAIL.test(values.email.trim()),
    message: values.message.trim().length < 10,
  };
}

/** A mailto link with the message ready to send, for when there is no backend. */
export function mailtoLink(to: string, values: ContactValues): string {
  const subject = `Portfolio message from ${values.name.trim()}`;
  const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}