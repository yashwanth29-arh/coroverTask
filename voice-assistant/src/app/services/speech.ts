import { Injectable, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SpeechService {
  recognition: any;
  isSupported = false;
  listening = false;

  constructor(private zone: NgZone) {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      this.recognition = new SR();
      this.recognition.lang = 'en-US';
      this.recognition.interimResults = true;
      this.isSupported = true;
    }
  }

  start(onText: (text: string, interim: boolean) => void, onEnd: () => void) {
    if (!this.isSupported) return;
    this.listening = true;

    this.recognition.onresult = (e: any) => {
      let interim = '', final = '';
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      this.zone.run(() => onText(final || interim, !!interim));
    };

    this.recognition.onend = () => this.zone.run(() => { this.listening = false; onEnd(); });
    this.recognition.onerror = () => this.zone.run(() => { this.listening = false; onEnd(); });
    this.recognition.start();
  }

  stop() {
    if (this.recognition) this.recognition.stop();
    this.listening = false;
  }

  speak(text: string) {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }
}
