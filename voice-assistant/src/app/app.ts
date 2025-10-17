import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Nl2brPipe } from './services/nl2br.pipe';
import { SpeechService } from './services/speech';
import { VoiceApi } from './services/voice-api';


interface Message {
  role: 'user' | 'assistant';
  text: string;
  time: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Nl2brPipe],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit, OnDestroy {
  messages: Message[] = [];
  interim = '';
  typing = false;

  chatForm!: FormGroup;
  listening: boolean = false;

  constructor(
    private fb: FormBuilder,
    public speech: SpeechService,
    private api: VoiceApi,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.chatForm = this.fb.group({
      prompt: ['', [Validators.required, Validators.minLength(1)]]
    });
    const saved = localStorage.getItem('chat-history');
    if (saved) this.messages = JSON.parse(saved);
  }

  saveHistory() {
    localStorage.setItem('chat-history', JSON.stringify(this.messages));
  }

  clearHistory() {
    this.messages = [];
    this.saveHistory();
  }

  startListening() {
    this.listening = true;
    if (!this.speech.isSupported) return;
    this.speech.start((txt, interim) => {
      if (interim) this.interim = txt;
      else {
        this.interim = '';
        this.chatForm.patchValue({ prompt: txt });
        this.send();

        setTimeout(() => this.stopListening(), 10000);
      }
    }, () => {
      this.interim = '';
      this.listening = false
      this.cd.detectChanges();
    });
    setTimeout(() => this.listening = false, 10000);
  }

  stopListening() {
    this.speech.stop();
    this.listening = false;
    this.interim = '';
  }

  async send() {
    if (this.chatForm.invalid) return;
    const text = this.chatForm.value.prompt!.trim();
    this.chatForm.reset();

    this.messages.push({ role: 'user', text, time: Date.now() });
    this.typing = true;

    const reply = await this.api.getResponse(text);
    console.log(reply);

    this.messages.push({ role: 'assistant', text: reply, time: Date.now() });
    this.typing = false;

    this.saveHistory();
    this.speech.speak(reply);
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.speech.stop();
  }
}
