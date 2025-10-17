import { TestBed } from '@angular/core/testing';

import { VoiceApi } from './voice-api';

describe('VoiceApi', () => {
  let service: VoiceApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
