import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RTCView } from 'react-native-webrtc';
import ViewShot from 'react-native-view-shot';
import Avatar from './Avatar';
import MIcon from './MIcon';
import { WEBRTC_MEDIA_ENABLED } from '../config';
import { colors, radii } from '../theme';

export type CallMode = 'voice' | 'video';
export type CallConnectionState = 'preview' | 'ringing' | 'connecting' | 'connected' | 'unavailable';

type Props = {
  visible: boolean;
  mode: CallMode;
  peerName: string;
  peerAvatar?: string | null;
  connectionState?: CallConnectionState;
  localStreamURL?: string | null;
  remoteStreamURL?: string | null;
  muted?: boolean;
  cameraOff?: boolean;
  onClose: () => void;
  onToggleMute?: () => void;
  onToggleCamera?: () => void;
  onFlipCamera?: () => void;
  onLivePhotoCaptured?: (uri: string) => void | Promise<void>;
};

export default function CallPreviewScreen({
  visible,
  mode,
  peerName,
  peerAvatar,
  connectionState = 'preview',
  localStreamURL = null,
  remoteStreamURL = null,
  muted = false,
  cameraOff = false,
  onClose,
  onToggleMute,
  onToggleCamera,
  onFlipCamera,
  onLivePhotoCaptured,
}: Props) {
  const [seconds, setSeconds] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const remoteShotRef = useRef<ViewShot>(null);
  const isVideo = mode === 'video';
  const hasRemoteVideo = Boolean(remoteStreamURL);
  const hasLocalVideo = Boolean(localStreamURL) && !cameraOff;
  const isLive = connectionState === 'connected' || hasRemoteVideo;

  useEffect(() => {
    if (!visible) {
      setSeconds(0);
      return;
    }
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [visible]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  const statusLabel =
    connectionState === 'unavailable'
      ? 'Not available'
      : connectionState === 'connected' || hasRemoteVideo
        ? 'Encrypted · connected'
        : connectionState === 'ringing'
          ? 'Ringing…'
          : connectionState === 'connecting'
            ? WEBRTC_MEDIA_ENABLED
              ? 'Connecting media…'
              : 'Connecting…'
            : isVideo
              ? 'Encrypted video'
              : 'Encrypted voice';

  const triggerFlash = () => {
    flashOpacity.setValue(0.85);
    Animated.timing(flashOpacity, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  const onShutter = async () => {
    if (!onLivePhotoCaptured || capturing) return;
    setCapturing(true);
    triggerFlash();
    try {
      let uri: string | null = null;
      if (remoteShotRef.current?.capture) {
        uri = await remoteShotRef.current.capture();
      }
      if (uri) {
        await onLivePhotoCaptured(uri);
      }
    } finally {
      setCapturing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.container, isVideo ? styles.videoBg : styles.voiceBg]}>
        <Animated.View pointerEvents="none" style={[styles.flash, { opacity: flashOpacity }]} />

        <View style={styles.previewBadge}>
          <MIcon
            name={isLive ? 'lock' : connectionState === 'connecting' ? 'sync' : 'science'}
            size={16}
            color={colors.goldLight}
          />
          <Text style={styles.previewText}>
            {isLive ? 'Live call' : connectionState === 'connecting' ? 'Connecting…' : 'Call UI'}
          </Text>
        </View>

        {isVideo ? (
          <View style={styles.remoteVideo}>
            {hasRemoteVideo ? (
              <ViewShot ref={remoteShotRef} style={StyleSheet.absoluteFill} options={{ format: 'jpg', quality: 0.92 }}>
                <RTCView
                  streamURL={remoteStreamURL!}
                  style={StyleSheet.absoluteFill}
                  objectFit="cover"
                  mirror={false}
                />
              </ViewShot>
            ) : (
              <>
                <Avatar name={peerName} size={120} gold imageUrl={peerAvatar} />
                <Text style={styles.peerName}>{peerName}</Text>
              </>
            )}
            <Text style={[styles.status, hasRemoteVideo && styles.statusOverlay]}>{statusLabel}</Text>
            <Text style={[styles.timer, hasRemoteVideo && styles.timerOverlay]}>
              {mm}:{ss}
            </Text>

            <View style={styles.selfPreview}>
              {hasLocalVideo ? (
                <RTCView
                  streamURL={localStreamURL!}
                  style={StyleSheet.absoluteFill}
                  objectFit="cover"
                  mirror
                  zOrder={1}
                />
              ) : (
                <>
                  <MIcon name="videocam" size={22} color={colors.goldLight} />
                  <Text style={styles.selfLabel}>You</Text>
                </>
              )}
            </View>

            {onLivePhotoCaptured && isVideo ? (
              <Pressable
                style={[styles.shutterWrap, capturing && styles.shutterDisabled]}
                onPress={onShutter}
                disabled={capturing}
                accessibilityLabel="Capture live photo during call">
                <View style={styles.shutterOuter}>
                  <View style={styles.shutterInner} />
                </View>
                <Text style={styles.shutterLabel}>Live photo</Text>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <View style={styles.voiceCenter}>
            <Avatar name={peerName} size={140} gold imageUrl={peerAvatar} />
            <Text style={styles.peerName}>{peerName}</Text>
            <Text style={styles.status}>{statusLabel}</Text>
            <Text style={styles.timer}>
              {mm}:{ss}
            </Text>
          </View>
        )}

        <View style={styles.controls}>
          <Pressable style={styles.controlItem} onPress={onToggleMute}>
            <View style={[styles.controlCircle, muted && styles.controlActive]}>
              <MIcon name={muted ? 'mic-off' : 'mic'} size={24} color={colors.text} />
            </View>
            <Text style={styles.controlLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
          </Pressable>

          <Pressable style={styles.controlItem} onPress={isVideo ? onToggleCamera : undefined}>
            <View style={[styles.controlCircle, cameraOff && styles.controlActive]}>
              <MIcon
                name={isVideo ? (cameraOff ? 'videocam-off' : 'videocam') : 'volume-up'}
                size={24}
                color={colors.text}
              />
            </View>
            <Text style={styles.controlLabel}>{isVideo ? (cameraOff ? 'Cam on' : 'Cam off') : 'Speaker'}</Text>
          </Pressable>

          <Pressable style={styles.endCall} onPress={onClose}>
            <MIcon name="call-end" size={32} color="#fff" />
          </Pressable>

          <Pressable style={styles.controlItem} onPress={isVideo ? onFlipCamera : undefined}>
            <View style={styles.controlCircle}>
              <MIcon name="flip-camera-ios" size={24} color={colors.text} />
            </View>
            <Text style={styles.controlLabel}>Flip</Text>
          </Pressable>

          {isVideo && onLivePhotoCaptured ? (
            <Pressable style={styles.controlItem} onPress={onShutter} disabled={capturing}>
              <View style={[styles.controlCircle, styles.shutterControl]}>
                <MIcon name="photo-camera" size={24} color={colors.goldLight} />
              </View>
              <Text style={styles.controlLabel}>Snap</Text>
            </Pressable>
          ) : (
            <View style={styles.controlItem}>
              <View style={styles.controlCircle}>
                <MIcon name="more-vert" size={24} color={colors.text} />
              </View>
              <Text style={styles.controlLabel}>More</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>
          {isLive
            ? 'End-to-end encrypted · Tau WebRTC · live photos save to this chat'
            : WEBRTC_MEDIA_ENABLED
              ? 'Waiting for peer to connect…'
              : 'Enable WebRTC in config for live media'}
        </Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 56, paddingBottom: 32 },
  voiceBg: { backgroundColor: '#0a1014' },
  videoBg: { backgroundColor: '#050508' },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    zIndex: 50,
  },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: colors.goldDim,
    borderRadius: radii.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    zIndex: 10,
  },
  previewText: { color: colors.goldLight, fontSize: 12, fontWeight: '600' },
  voiceCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  remoteVideo: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  peerName: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 20, zIndex: 2 },
  status: { color: colors.textMuted, marginTop: 8, textAlign: 'center', paddingHorizontal: 24, zIndex: 2 },
  statusOverlay: {
    position: 'absolute',
    top: 72,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  timer: { color: colors.goldLight, fontSize: 18, marginTop: 12, fontWeight: '600', zIndex: 2 },
  timerOverlay: {
    position: 'absolute',
    top: 108,
    marginTop: 0,
    color: '#fff',
  },
  selfPreview: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 100,
    height: 140,
    borderRadius: radii.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
    zIndex: 5,
  },
  selfLabel: { color: colors.textMuted, fontSize: 12 },
  shutterWrap: {
    position: 'absolute',
    bottom: 36,
    alignItems: 'center',
    gap: 6,
    zIndex: 6,
  },
  shutterDisabled: { opacity: 0.5 },
  shutterOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
  },
  shutterLabel: { color: '#fff', fontSize: 11, fontWeight: '600' },
  controls: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    paddingHorizontal: 12,
    marginTop: 12,
    zIndex: 10,
  },
  controlItem: { alignItems: 'center', width: 64 },
  controlCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlActive: {
    backgroundColor: colors.goldDim,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  shutterControl: {
    borderWidth: 1,
    borderColor: colors.glassBorder,
    backgroundColor: colors.goldDim,
  },
  controlLabel: { color: colors.textSoft, fontSize: 11, marginTop: 6 },
  endCall: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  footer: {
    color: colors.textSoft,
    textAlign: 'center',
    fontSize: 11,
    paddingHorizontal: 24,
    marginTop: 20,
    lineHeight: 16,
    zIndex: 10,
  },
});
