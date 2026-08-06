/**
 * Voice note recording for Tau Talk mobile.
 * Requires react-native-audio-recorder-player (rebuild native app after install).
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AudioRecorderPlayer = require('react-native-audio-recorder-player').default as {
  new (): {
    startRecorder: (path?: string) => Promise<string>;
    stopRecorder: () => Promise<string>;
  };
};

let recorder: InstanceType<typeof AudioRecorderPlayer> | null = null;

function getRecorder() {
  if (!recorder) recorder = new AudioRecorderPlayer();
  return recorder;
}

export async function startVoiceRecording(): Promise<void> {
  await getRecorder().startRecorder();
}

export async function stopVoiceRecording(): Promise<string> {
  return getRecorder().stopRecorder();
}
