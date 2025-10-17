import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VoiceApi {
  private responses: { pattern: RegExp; reply: string }[] = [
    { pattern: /\bhello\b|\bhi\b|\bhey\b/i, reply: 'Hello! I am your assistant. How can I help you today?' },
    { pattern: /\bhow are you\b|\bhow r u\b/i, reply: "I'm a dummy assistant, but I'm running great! How are you?" },
    { pattern: /\bwhat time\b|\bcurrent time\b/i, reply: `I can't read the system clock from this dummy API, but it's a great time to code!` },
    { pattern: /\bwho are you\b|\bwhat is your name\b/i, reply: 'I am a demo voice assistant built with Angular.' },
    { pattern: /\bopen google\b|\bsearch\b/i, reply: 'I would open Google but this is a dummy assistant. Try searching on your browser!' },
    { pattern: /\bthank you\b|\bthanks\b/i, reply: "You're welcome! Anything else?" },
    { pattern: /.*/i, reply: "Sorry, I don't have an answer for that yet. Try 'Hello' or 'How are you?'" }
  ];

  constructor() { }

  getResponse(text: string): Promise<string> {
    text = text || '';
    const found = this.responses.find(r => r.pattern.test(text));
    return new Promise(resolve => {
      setTimeout(() => resolve(found ? found.reply : "I couldn't understand that."), 250);
    });
  }
}
