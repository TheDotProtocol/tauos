'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createClientSttRecognizer,
  fetchVoicePipelineStatus,
  sendVoiceTurn,
  speakClientTts,
  type BrowserSpeechRecognition,
} from '@/lib/tau-ai-app/voice-client';
import type { VoicePipelineStatus, VoiceVerificationLevel } from '@/lib/tau-ai-app/voice-types';

export type VoiceSessionPhase =
  | 'idle'
  | 'loading'
  | 'listening'
  | 'processing'
  | 'done'
  | 'error';

export function useTauAiVoice() {
  const [phase, setPhase] = useState<VoiceSessionPhase>('loading');
  const [status, setStatus] = useState<VoicePipelineStatus | null>(null);
  const [transcription, setTranscription] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verification, setVerification] = useState<VoiceVerificationLevel>('UI_VERIFIED');

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const sttRef = useRef<BrowserSpeechRecognition | null>(null);
  const clientTranscriptRef = useRef('');

  useEffect(() => {
    fetchVoicePipelineStatus()
      .then((s) => {
        setStatus(s);
        setPhase('idle');
      })
      .catch(() => {
        setError('Could not load voice capabilities');
        setPhase('error');
      });
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRef.current?.state === 'recording') {
      mediaRef.current.stop();
    }
    mediaRef.current?.stream.getTracks().forEach((t) => t.stop());
    sttRef.current?.stop();
  }, []);

  const processAudio = useCallback(async (audio: Blob, clientText?: string) => {
    setPhase('processing');
    setError(null);
    try {
      const result = await sendVoiceTurn({
        audio,
        transcription: clientText,
      });

      setTranscription(result.transcription);
      setResponse(result.response ?? '');
      setVerification(result.endToEndLevel);

      if (result.useClientStt && !result.transcription) {
        setError('No speech detected. Try again or use keyboard input.');
        setPhase('error');
        return;
      }

      if (result.response && result.useClientTts) {
        speakClientTts(result.response);
      }

      setPhase('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Voice processing failed');
      setPhase('error');
    }
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setTranscription('');
    setResponse('');
    clientTranscriptRef.current = '';

    const useClientSttFirst = !status?.stt.configured;
    const recognizer = useClientSttFirst ? createClientSttRecognizer() : null;

    if (recognizer) {
      sttRef.current = recognizer;
      setPhase('listening');

      recognizer.onresult = (event) => {
        const text = event.results[0]?.[0]?.transcript ?? '';
        clientTranscriptRef.current = text.trim();
      };
      recognizer.onerror = () => {
        clientTranscriptRef.current = '';
      };
      recognizer.start();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        void processAudio(blob, clientTranscriptRef.current || undefined);
      };

      recorder.start();
      if (!recognizer) setPhase('listening');

      window.setTimeout(() => {
        stopRecording();
      }, (status?.maxDurationSec ?? 30) * 1000);
    } catch {
      stopRecording();
      setError('Microphone access denied or unavailable');
      setPhase('error');
    }
  }, [processAudio, status, stopRecording]);

  const reset = useCallback(() => {
    stopRecording();
    setPhase(status ? 'idle' : 'loading');
    setTranscription('');
    setResponse('');
    setError(null);
    setVerification('UI_VERIFIED');
  }, [status, stopRecording]);

  return {
    phase,
    status,
    transcription,
    response,
    error,
    verification,
    startListening,
    stopRecording,
    reset,
  };
}
