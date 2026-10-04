/** Shared by the contact form (client) and /api/contact (server). */

export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const LIMITS = { name: 100, email: 254, message: 5000, messageMin: 10 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: Partial<Record<keyof ContactInput, unknown>>): ContactErrors {
  const errors: ContactErrors = {};
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!name) errors.name = "Tell me who's asking.";
  else if (name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;

  if (!email) errors.email = "I need an email to reply to.";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.email = "That email doesn't look right.";

  if (!message) errors.message = "Don't leave the press room empty-handed.";
  else if (message.length < LIMITS.messageMin) errors.message = `A little more detail please (${LIMITS.messageMin}+ characters).`;
  else if (message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`;

  return errors;
}
