import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceAssistant } from './voice-assistant';

describe('VoiceAssistant', () => {
  let component: VoiceAssistant;
  let fixture: ComponentFixture<VoiceAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VoiceAssistant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoiceAssistant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
