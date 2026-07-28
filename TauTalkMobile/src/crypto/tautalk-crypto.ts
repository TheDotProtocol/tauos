/**
 * Tau Talk E2E crypto — pure JS (@noble/*), compatible with web tautalk-crypto.ts
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// CommonJS requires avoid Metro ESM interop issues with @noble/* subpaths on Hermes.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { gcm } = require('@noble/ciphers/aes') as typeof import('@noble/ciphers/aes');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { p256 } = require('@noble/curves/nist') as typeof import('@noble/curves/nist');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sha256 } = require('@noble/hashes/sha2') as typeof import('@noble/hashes/sha2');

const KEY_STORAGE = 'tautalk_keypair_v2';

const P256_SPKI_PREFIX = Uint8Array.from([
  0x30, 0x59, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01, 0x06, 0x08, 0x2a,
  0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07, 0x03, 0x42, 0x00,
]);

const P256_PKCS8_PREFIX = Uint8Array.from([
  0x30, 0x81, 0x87, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02,
  0x01, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07, 0x04, 0x6d, 0x30, 0x6b, 0x02,
  0x01, 0x01, 0x04, 0x20,
]);

function utf8Encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function utf8Decode(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

function b64FromBytes(bytes: Uint8Array): string {
  return btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(''));
}

function bytesFromB64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

function spkiToPublicKey(spkiB64: string): Uint8Array {
  const der = bytesFromB64(spkiB64);
  return der.slice(-65);
}

function pkcs8ToPrivateKey(pkcs8B64: string): Uint8Array {
  const der = bytesFromB64(pkcs8B64);
  return der.slice(-32);
}

function publicKeyToSpki(uncompressed: Uint8Array): Uint8Array {
  const out = new Uint8Array(P256_SPKI_PREFIX.length + uncompressed.length);
  out.set(P256_SPKI_PREFIX);
  out.set(uncompressed, P256_SPKI_PREFIX.length);
  return out;
}

function privateKeyToPkcs8(scalar: Uint8Array): Uint8Array {
  const out = new Uint8Array(P256_PKCS8_PREFIX.length + scalar.length);
  out.set(P256_PKCS8_PREFIX);
  out.set(scalar, P256_PKCS8_PREFIX.length);
  return out;
}

function deriveLegacyKeyBytes(conversationId: string): Uint8Array {
  return sha256(utf8Encode(`tautalk:shared:v1:${conversationId}`));
}

function deriveDirectKeyBytes(
  conversationId: string,
  privateKeyB64: string,
  peerPublicKeyB64: string
): Uint8Array {
  const priv = pkcs8ToPrivateKey(privateKeyB64);
  const peer = spkiToPublicKey(peerPublicKeyB64);
  const shared = p256.getSharedSecret(priv, peer, false);
  const rawBits = shared.slice(1, 33);
  const salted = utf8Encode(`tautalk:ecdh:v2:${conversationId}:`);
  const combined = new Uint8Array(salted.length + rawBits.length);
  combined.set(salted, 0);
  combined.set(rawBits, salted.length);
  return sha256(combined);
}

function deriveGroupKeyBytes(conversationId: string, publicKeys: string[]): Uint8Array {
  const sorted = [...publicKeys].sort().join('|');
  return sha256(utf8Encode(`tautalk:group:v2:${conversationId}:${sorted}`));
}

function encryptWithKey(key: Uint8Array, plaintext: string): string {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = utf8Encode(plaintext);
  const aes = gcm(key, iv);
  const ciphertext = aes.encrypt(encoded);
  const combined = new Uint8Array(iv.length + ciphertext.length);
  combined.set(iv, 0);
  combined.set(ciphertext, iv.length);
  return b64FromBytes(combined);
}

function decryptWithKey(key: Uint8Array, payload: string): string | null {
  try {
    const combined = bytesFromB64(payload);
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const aes = gcm(key, iv);
    const decrypted = aes.decrypt(data);
    return utf8Decode(decrypted);
  } catch {
    return null;
  }
}

export async function getOrCreateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const stored = await AsyncStorage.getItem(KEY_STORAGE);
  if (stored) return JSON.parse(stored);
  const pair = await generateKeyPair();
  await AsyncStorage.setItem(KEY_STORAGE, JSON.stringify(pair));
  return pair;
}

export type ConversationCryptoContext = {
  type: 'direct' | 'group';
  myPublicKey: string;
  participantPublicKeys: string[];
};

export async function deriveConversationKeyBytes(
  conversationId: string,
  ctx: ConversationCryptoContext
): Promise<Uint8Array> {
  const { privateKey } = await getOrCreateKeyPair();
  const others = ctx.participantPublicKeys.filter((k) => k && k !== ctx.myPublicKey);

  if (ctx.type === 'direct' && others.length === 1) {
    return deriveDirectKeyBytes(conversationId, privateKey, others[0]);
  }
  const allKeys = ctx.participantPublicKeys.filter(Boolean);
  if (allKeys.length >= 2) {
    return deriveGroupKeyBytes(conversationId, allKeys);
  }
  return deriveLegacyKeyBytes(conversationId);
}

export async function encryptMessage(
  conversationId: string,
  plaintext: string,
  ctx?: ConversationCryptoContext
): Promise<string> {
  const key = ctx
    ? await deriveConversationKeyBytes(conversationId, ctx)
    : deriveLegacyKeyBytes(conversationId);
  return encryptWithKey(key, plaintext);
}

export async function decryptMessage(
  conversationId: string,
  payload: string,
  ctx?: ConversationCryptoContext
): Promise<string> {
  const keys: Uint8Array[] = [];
  if (ctx) {
    keys.push(await deriveConversationKeyBytes(conversationId, ctx));
  }
  keys.push(deriveLegacyKeyBytes(conversationId));

  for (const key of keys) {
    const text = decryptWithKey(key, payload);
    if (text !== null) return text;
  }
  return '[Encrypted message]';
}

export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const priv = p256.utils.randomPrivateKey();
  const pub = p256.getPublicKey(priv, false);
  return {
    publicKey: b64FromBytes(publicKeyToSpki(pub)),
    privateKey: b64FromBytes(privateKeyToPkcs8(priv)),
  };
}

export async function buildCryptoContext(
  conversationId: string,
  convType: string,
  participants: Array<{ publicKey?: string | null }>
): Promise<ConversationCryptoContext> {
  const { publicKey } = await getOrCreateKeyPair();
  const participantPublicKeys = participants
    .map((p) => p.publicKey)
    .filter((k): k is string => Boolean(k));
  if (!participantPublicKeys.includes(publicKey)) {
    participantPublicKeys.push(publicKey);
  }
  return {
    type: convType === 'group' ? 'group' : 'direct',
    myPublicKey: publicKey,
    participantPublicKeys,
  };
}
