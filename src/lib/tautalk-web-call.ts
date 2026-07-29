import { acceptCall, endCall, missCall, pollCallSignals, sendCallSignal, type CallSession } from '@/lib/tautalk-web-api';
import { TAUTALK_RING_TIMEOUT_MS, TAUTALK_UNAVAILABLE_MESSAGE } from '@/lib/tautalk-call-constants';

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

const SIGNAL_POLL_MS = 1500;

export type WebCallMediaState = {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  muted: boolean;
  cameraOff: boolean;
  connectionState: RTCPeerConnectionState | 'idle' | 'ringing' | 'unavailable';
};

type Listener = (state: WebCallMediaState) => void;

export class WebCallManager {
  private token = '';
  private session: CallSession | null = null;
  private role: 'caller' | 'callee' = 'caller';
  private mode: 'voice' | 'video' = 'voice';
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private lastSignalAt: string | undefined;
  private iceQueue: RTCIceCandidateInit[] = [];
  private remoteDescriptionSet = false;
  private listeners = new Set<Listener>();
  private ringTimer: ReturnType<typeof setTimeout> | null = null;
  private callAnswered = false;
  private unansweredHandled = false;
  private mediaState: WebCallMediaState = {
    localStream: null,
    remoteStream: null,
    muted: false,
    cameraOff: false,
    connectionState: 'idle',
  };

  onConnected: (() => void) | null = null;
  onFailed: ((message: string) => void) | null = null;
  onUnanswered: (() => void) | null = null;

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.mediaState);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    this.listeners.forEach((l) => l(this.mediaState));
  }

  private patch(patch: Partial<WebCallMediaState>) {
    this.mediaState = { ...this.mediaState, ...patch };
    this.emit();
  }

  getSession() {
    return this.session;
  }

  async startOutgoing(token: string, session: CallSession, mode: 'voice' | 'video') {
    this.token = token;
    this.session = session;
    this.role = 'caller';
    this.mode = mode;
    this.callAnswered = false;
    this.unansweredHandled = false;
    this.patch({ connectionState: 'ringing' });
    const ok = await this.bootstrap(true);
    if (ok) this.startUnansweredTimer();
    return ok;
  }

  async startIncoming(token: string, session: CallSession, mode: 'voice' | 'video') {
    this.token = token;
    this.session = session;
    this.role = 'callee';
    this.mode = mode;
    await acceptCall(token, session.id);
    return this.bootstrap(false);
  }

  private async bootstrap(createOffer: boolean): Promise<boolean> {
    if (!this.session || typeof window === 'undefined') return false;
    try {
      this.patch({ connectionState: 'connecting' });

      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: this.mode === 'video',
      });
      this.patch({ localStream: this.localStream });

      this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      this.localStream.getTracks().forEach((t) => this.pc!.addTrack(t, this.localStream!));

      this.pc.ontrack = (ev) => {
        const stream = ev.streams[0];
        if (stream) {
          this.remoteStream = stream;
          this.patch({ remoteStream: stream });
        }
      };

      this.pc.onicecandidate = (ev) => {
        if (ev.candidate && this.session) {
          sendCallSignal(this.token, this.session.id, 'ice-candidate', ev.candidate.toJSON()).catch(
            () => {}
          );
        }
      };

      this.pc.onconnectionstatechange = () => {
        const state = this.pc?.connectionState ?? 'idle';
        this.patch({ connectionState: state });
        if (state === 'connected') {
          this.markAnswered();
          this.onConnected?.();
        }
        if (state === 'failed' || state === 'disconnected') {
          this.onFailed?.('Call connection lost');
        }
      };

      if (createOffer) {
        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        await sendCallSignal(this.token, this.session.id, 'offer', offer);
      }

      this.startPolling();
      return true;
    } catch (e) {
      this.onFailed?.(e instanceof Error ? e.message : 'Could not access microphone/camera');
      return false;
    }
  }

  private startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => this.pollSignals().catch(() => {}), SIGNAL_POLL_MS);
    this.pollSignals().catch(() => {});
  }

  private stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private parsePayload(payload: unknown): unknown {
    if (typeof payload === 'string') {
      try {
        return JSON.parse(payload);
      } catch {
        return payload;
      }
    }
    return payload;
  }

  private async pollSignals() {
    if (!this.session) return;
    const signals = await pollCallSignals(this.token, this.session.id, this.lastSignalAt);
    for (const s of signals) {
      this.lastSignalAt = s.created_at;
      await this.handleSignal(s.signal_type, this.parsePayload(s.payload));
    }
  }

  private async handleSignal(type: string, payload: unknown) {
    if (!this.pc || !this.session) return;

    if (type === 'offer') {
      const offer = payload as RTCSessionDescriptionInit;
      await this.pc.setRemoteDescription(offer);
      this.remoteDescriptionSet = true;
      await this.flushIce();
      if (this.role === 'callee') {
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        await sendCallSignal(this.token, this.session.id, 'answer', answer);
      }
      return;
    }

    if (type === 'answer') {
      this.markAnswered();
      await this.pc.setRemoteDescription(payload as RTCSessionDescriptionInit);
      this.remoteDescriptionSet = true;
      await this.flushIce();
      return;
    }

    if (type === 'ice-candidate') {
      const c = payload as RTCIceCandidateInit;
      if (!c?.candidate) return;
      if (!this.remoteDescriptionSet) {
        this.iceQueue.push(c);
        return;
      }
      try {
        await this.pc.addIceCandidate(c);
      } catch {
        /* ignore duplicate / late candidates */
      }
      return;
    }

    if (type === 'hangup') {
      this.onFailed?.('Call ended');
    }
  }

  private async flushIce() {
    if (!this.pc) return;
    while (this.iceQueue.length) {
      const c = this.iceQueue.shift()!;
      if (!c?.candidate) continue;
      try {
        await this.pc.addIceCandidate(c);
      } catch {
        /* ignore */
      }
    }
  }

  toggleMute() {
    const track = this.localStream?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    this.patch({ muted: !track.enabled });
  }

  toggleCamera() {
    const track = this.localStream?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    this.patch({ cameraOff: !track.enabled });
  }

  private clearRingTimer() {
    if (this.ringTimer) {
      clearTimeout(this.ringTimer);
      this.ringTimer = null;
    }
  }

  private markAnswered() {
    this.callAnswered = true;
    this.clearRingTimer();
  }

  private startUnansweredTimer() {
    if (this.role !== 'caller') return;
    this.clearRingTimer();
    this.ringTimer = setTimeout(() => {
      void this.handleUnanswered();
    }, TAUTALK_RING_TIMEOUT_MS);
  }

  private async handleUnanswered() {
    if (this.callAnswered || this.unansweredHandled) return;
    this.unansweredHandled = true;
    this.patch({ connectionState: 'unavailable' });
    if (this.session) {
      await missCall(this.token, this.session.id).catch(() => {});
      await sendCallSignal(this.token, this.session.id, 'hangup', {}).catch(() => {});
    }
    await this.cleanup(false);
    this.onUnanswered?.();
  }

  private async cleanup(endRemote = true) {
    this.clearRingTimer();
    this.stopPolling();
    if (endRemote && this.session) {
      await endCall(this.token, this.session.id).catch(() => {});
    }
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.pc?.close();
    this.pc = null;
    this.localStream = null;
    this.remoteStream = null;
    this.session = null;
    this.iceQueue = [];
    this.remoteDescriptionSet = false;
    this.lastSignalAt = undefined;
    this.callAnswered = false;
    this.patch({
      localStream: null,
      remoteStream: null,
      muted: false,
      cameraOff: false,
      connectionState: 'idle',
    });
  }

  async hangup() {
    this.clearRingTimer();
    if (this.session) {
      await sendCallSignal(this.token, this.session.id, 'hangup', {}).catch(() => {});
    }
    await this.cleanup(true);
  }
}
