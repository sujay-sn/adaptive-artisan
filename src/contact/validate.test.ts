import { describe, expect, it } from 'vitest';
import { contactProblems, mailtoLink } from './validate';

describe('contact form', () => {
  it('flags empty names, bad emails, and messages too short to answer', () => {
    expect(contactProblems({ name: ' ', email: 'not-an-email', message: 'hi' })).toEqual({ name: true, email: true, message: true });
    expect(contactProblems({ name: 'Ada', email: 'ada@example.com', message: 'Hello, are you hiring?' })).toEqual({ name: false, email: false, message: false });
  });

  it('builds a mailto link with an encoded subject and body', () => {
    const link = mailtoLink('me@example.com', { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello & welcome' });
    expect(link.startsWith('mailto:me@example.com?subject=')).toBe(true);
    expect(link).toContain(encodeURIComponent('Portfolio message from Ada Lovelace'));
    expect(link).toContain(encodeURIComponent('Hello & welcome'));
  });
});