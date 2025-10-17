// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { VoiceApi } from '../../services/voice-api';
// import { Speech } from '../../services/speech';
// import { Form, FormBuilder, FormGroup } from '@angular/forms';

// type Message = {
//   id: string;
//   role: 'user' | 'assistant';
//   text: string;
//   time: number;
//   speaking?: boolean;
// };

// @Component({
//   selector: 'app-voice-assistant',
//   standalone: false,
//   templateUrl: './voice-assistant.html',
//   styleUrl: './voice-assistant.scss'
// })
// export class VoiceAssistant implements OnDestroy, OnInit {
//   title = 'Voice Assistant — Chat UI';
//   inputText = '';
//   messages: Message[] = [];
//   listening = false;
//   interim = '';
//   supportMsg = '';
//   assistantTyping = false;

//   constructor(public speech: Speech, private api: VoiceApi) {
//     if (!this.speech.isSupported) {
//       this.supportMsg = 'Speech Recognition not supported in this browser. Use Chrome/Edge on HTTPS (or localhost).';
//     }
//   }

//   ngOnInit() {
//     // load history
//     const raw = localStorage.getItem('va_chat_history_v1');
//     if (raw) {
//       try {
//         this.messages = JSON.parse(raw) as Message[];
//       } catch {
//         this.messages = [];
//       }
//     }
//   }

//   persist() {
//     localStorage.setItem('va_chat_history_v1', JSON.stringify(this.messages));
//   }

//   startListening() {
//     if (!this.speech.isSupported) return;
//     this.listening = true;
//     this.interim = '';
//     this.speech.start((text: string, interim: boolean) => {
//       if (interim) {
//         this.interim = text;
//       } else {
//         // final
//         this.interim = '';
//         if (text && text.trim()) {
//           this.pushUserMessage(text.trim());
//           this.handleUserQuery(text.trim());
//         }
//         // stop state handled in onEnd below
//       }
//     }, () => {
//       this.listening = false;
//       this.interim = '';
//     });
//   }

//   stopListening() {
//     this.speech.stop();
//     this.listening = false;
//     this.interim = '';
//   }

//   pushUserMessage(text: string) {
//     const msg: Message = {
//       id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
//       role: 'user',
//       text,
//       time: Date.now()
//     };
//     this.messages.push(msg);
//     this.persist();
//   }

//   pushAssistantMessage(text: string, speaking = false) {
//     const msg: Message = {
//       id: String(Date.now()) + Math.random().toString(36).slice(2, 6),
//       role: 'assistant',
//       text,
//       time: Date.now(),
//       speaking
//     };

//     this.messages.push(msg);
//     this.persist();
//   }

//   async handleUserQuery(q: string) {
//     // show typing indicator
//     this.assistantTyping = true;
//     // add placeholder assistant message (empty text) so UI shows bubble
//     const placeholderId = 'typing-' + Date.now();
//     this.pushAssistantMessage('', false);

//     try {
//       const reply = await this.api.getResponse(q);
//       console.log(reply);

//       // replace last assistant empty bubble with reply
//       // find last assistant message with empty text
//       for (let i = this.messages.length - 1; i >= 0; i--) {
//         if (this.messages[i].role === 'assistant' && (!this.messages[i].text || this.messages[i].text.trim() === '')) {
//           this.messages[i].text = reply;
//           this.messages[i].time = Date.now();
//           break;
//         }
//       }
//       this.persist();
//       this.assistantTyping = false;

//       // speak reply
//       this.speech.speak(reply, () => {
//         // no-op after speaking
//       });
//     } catch (err) {
//       this.assistantTyping = false;
//       for (let i = this.messages.length - 1; i >= 0; i--) {
//         if (this.messages[i].role === 'assistant' && (!this.messages[i].text || this.messages[i].text.trim() === '')) {
//           this.messages[i].text = 'Something went wrong.';
//           this.messages[i].time = Date.now();
//           break;
//         }
//       }
//       this.persist();
//     }
//   }

//   async sendText() {
//     const text = (this.inputText || this.interim || '').trim();
//     if (!text) return;
//     this.pushUserMessage(text);
//     this.inputText = '';
//     await this.handleUserQuery(text);
//   }

//   clearHistory() {
//     if (!confirm('Clear chat history?')) return;
//     this.messages = [];
//     this.persist();
//   }

//   formatTime(ts: number) {
//     const d = new Date(ts);
//     return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   }

//   ngOnDestroy() {
//     this.speech.stop();
//   }

// }
