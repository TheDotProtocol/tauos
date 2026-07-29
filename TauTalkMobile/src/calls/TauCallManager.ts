import {
  mediaDevices,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
} from 'react-native-webrtc';
import {
  acceptCall,
  endCall,
  missCall,
  pollCallSignals,
  sendCallSignal,
  type CallSession,
} from '../api/client';
import { ICE_SERVERS, SIGNAL_POLL_MS } from './iceConfig';
import { ensureCallPermissions } from './permissions';
import { TAUTALK_RING_TIMEOUT_MS } from './callConstants';

export type CallMediaState = {
  localStreamURL: string | null;
  remoteStreamURL: string | null;
  muted: boolean;
  cameraOff: boolean;
};

type Listener = (state: CallMediaState) => void;

export type CallRole = 'caller' | 'callee';

export class TauCallManager {
  private token = '';
  private session: CallSession | null = null;
  private role: CallRole = 'caller';
  private mode: 'voice' | 'video' = 'voice';
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private pollTimer: ReturnType<typeof setInterval> | null = null;
  private lastSignalAt: string | undefined;
  private iceQueue: RTCIceCandidateInit[] = [];
  private remoteDescriptionSet = false;
  private listeners = new Set<Listener>();
  private mediaState: CallMediaState = {
    localStreamURL: null,
    remoteStreamURL: null,
    muted: false,
    cameraOff: false,
  };
  onConnected: (() => void) | null = null;
  onFailed: ((message: string) => void) | null = null;
  onUnanswered: (() => void) | null = null;

  private ringTimer: ReturnType<typeof setTimeout> | null = null;
  private callAnswered = false;
  private unansweredHandled = false;

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.mediaState);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    for (const listener of this.listeners) {
      listener(this.mediaState);
    }
  }

  private patchMedia(patch: Partial<CallMediaState>) {
    this.mediaState = { ...this.mediaState, ...patch };
    this.emit();
  }

  getSession() {
    return this.session;
  }

  getRemoteStream() {
    return this.remoteStream;
  }

  async startOutgoing(
    token: string,
    session: CallSession,
    mode: 'voice' | 'video'
  ): Promise<boolean> {
    this.token = token;
    this.session = session;
    this.role = 'caller';
    this.mode = mode;
    this.callAnswered = false;
    this.unansweredHandled = false;
    const ok = await this.bootstrap(true);
    if (ok) this.startUnansweredTimer();
    return ok;
  }

  async startIncoming(
    token: string,
    session: CallSession,
    mode: 'voice' | 'video'
  ): Promise<boolean> {
    this.token = token;
    this.session = session;
    this.role = 'callee';
    this.mode = mode;
    await acceptCall(token, session.id);
    return this.bootstrap(false);
  }

  private async bootstrap(createOffer: boolean): Promise<boolean> {
    if (!this.session) return false;

    const ok = await ensureCallPermissions(this.mode === 'video');
    if (!ok) {
      this.onFailed?.('Microphone and camera permissions are required for calls');
      return false;
    }

    try {
      await this.acquireMedia();
      this.createPeerConnection();

      if (createOffer) {
        const offer = await this.pc!.createOffer({});
        await this.pc!.setLocalDescription(offer);
        await sendCallSignal(this.token, this.session.id, 'offer', offer);
      }

      this.startPolling();
      return true;
    } catch (e) {
      this.onFailed?.(e instanceof Error ? e.message : 'Could not start call media');
      return false;
    }
  }

  private async acquireMedia() {
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: this.mode === 'video' ? { facingMode: 'user' } : false,
    });
    this.localStream = stream;
    this.patchMedia({ localStreamURL: stream.toURL() });
  }

  private createPeerConnection() {
    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        this.pc!.addTrack(track, this.localStream!);
      });
    }

    this.pc.ontrack = (event) => {
      const stream = event.streams?.[0];
      if (!stream) return;
      this.remoteStream = stream;
      this.patchMedia({ remoteStreamURL: stream.toURL() });
    };

    this.pc.onicecandidate = (event) => {
      if (!event.candidate || !this.session) return;
      sendCallSignal(this.token, this.session.id, 'ice-candidate', event.candidate.toJSON()).catch(
        () => {}
      );
    };

    this.pc.onconnectionstatechange = () => {
      const state = this.pc?.connectionState;
      if (state === 'connected') {
        this.markAnswered();
        this.onConnected?.();
      } else if (state === 'failed' || state === 'disconnected') {
        this.onFailed?.('Call connection lost');
      }
    };
  }

  private startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => {
      this.pollSignals().catch(() => {});
    }, SIGNAL_POLL_MS);
    this.pollSignals().catch(() => {});
  }

  private stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private async pollSignals() {
    if (!this.session) return;
    const signals = await pollCallSignals(this.token, this.session.id, this.lastSignalAt);
    for (const signal of signals) {
      this.lastSignalAt = signal.created_at;
      await this.handleSignal(signal.signal_type, signal.payload);
    }
  }

  private async handleSignal(type: string, payload: unknown) {
    if (!this.pc || !this.session) return;

    if (type === 'offer') {
      const offer = payload as RTCSessionDescriptionInit;
      await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
      this.remoteDescriptionSet = true;
      await this.flushIceQueue();

      if (this.role === 'callee') {
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        await sendCallSignal(this.token, this.session.id, 'answer', answer);
      }
      return;
    }

    if (type === 'answer') {
      this.markAnswered();
      const answer = payload as RTCSessionDescriptionInit;
      await this.pc.setRemoteDescription(new RTCSessionDescription(answer));
      this.remoteDescriptionSet = true;
      await this.flushIceQueue();
      return;
    }

    if (type === 'ice-candidate') {
      const candidate = payload as RTCIceCandidateInit;
      if (!this.remoteDescriptionSet) {
        this.iceQueue.push(candidate);
        return;
      }
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
      return;
    }

    if (type === 'hangup') {
      this.onFailed?.('Call ended');
    }
  }

  private async flushIceQueue() {
    if (!this.pc) return;
    while (this.iceQueue.length > 0) {
      const candidate = this.iceQueue.shift()!;
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  toggleMute() {
    const track = this.localStream?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    this.patchMedia({ muted: !track.enabled });
  }

  toggleCamera() {
    const track = this.localStream?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    this.patchMedia({ cameraOff: !track.enabled });
  }

  flipCamera() {
    const track = this.localStream?.getVideoTracks()[0] as { _switchCamera?: () => void } | undefined;
    track?._switchCamera?.();
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
    if (this.callAnswered || this.unansweredHandled || !this.session) return;
    this.unansweredHandled = true;
    await missCall(this.token, this.session.id).catch(() => {});
    await sendCallSignal(this.token, this.session.id, 'hangup', {}).catch(() => {});
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
    this.patchMedia({
      localStreamURL: null,
      remoteStreamURL: null,
      muted: false,
      cameraOff: false,
    });
  }

  async hangup() {
    if (this.session) {
      await sendCallSignal(this.token, this.session.id, 'hangup', {}).catch(() => {});
    }
    await this.cleanup(true);
  }
}
