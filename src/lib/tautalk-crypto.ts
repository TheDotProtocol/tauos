/**
 * Client-side E2E helpers for Tau Talk (Web Crypto API).
 * Per-conversation ECDH for direct chats; hashed participant keys for groups.
 */

const KEY_STORAGE = 'tautalk_keypair_v2';

export async function getOrCreateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  if (typeof window === 'undefined') {
    return generateKeyPair();
  }
  const stored = localStorage.getItem(KEY_STORAGE);
  if (stored) return JSON.parse(stored);
  const pair = await generateKeyPair();
  localStorage.setItem(KEY_STORAGE, JSON.stringify(pair));
  return pair;
}

export async function registerIdentityKey(token: string): Promise<void> {
  const { publicKey } = await getOrCreateKeyPair();
  await fetch('/api/tautalk/identity', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicKey }),
  });
}

async function importPublicKey(b64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey('spki', raw, { name: 'ECDH', namedCurve: 'P-256' }, true, []);
}

async function importPrivateKey(b64: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'pkcs8',
    raw,
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );
}

/** Legacy shared key (v1 messages). */
async function deriveLegacyKey(conversationId: string): Promise<CryptoKey> {
  const material = new TextEncoder().encode(`tautalk:shared:v1:${conversationId}`);
  const hash = await crypto.subtle.digest('SHA-256', material);
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function deriveDirectKey(
  conversationId: string,
  privateKeyB64: string,
  peerPublicKeyB64: string
): Promise<CryptoKey> {
  const privateKey = await importPrivateKey(privateKeyB64);
  const peerPublic = await importPublicKey(peerPublicKeyB64);
  const rawBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: peerPublic },
    privateKey,
    256
  );
  const salted = new TextEncoder().encode(`tautalk:ecdh:v2:${conversationId}:`);
  const combined = new Uint8Array(salted.length + rawBits.byteLength);
  combined.set(salted, 0);
  combined.set(new Uint8Array(rawBits), salted.length);
  const hash = await crypto.subtle.digest('SHA-256', combined);
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

async function deriveGroupKey(conversationId: string, publicKeys: string[]): Promise<CryptoKey> {
  const sorted = [...publicKeys].sort().join('|');
  const material = new TextEncoder().encode(`tautalk:group:v2:${conversationId}:${sorted}`);
  const hash = await crypto.subtle.digest('SHA-256', material);
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

export type ConversationCryptoContext = {
  type: 'direct' | 'group';
  myPublicKey: string;
  participantPublicKeys: string[];
};

export async function deriveConversationKey(
  conversationId: string,
  ctx: ConversationCryptoContext
): Promise<CryptoKey> {
  const { privateKey } = await getOrCreateKeyPair();
  const others = ctx.participantPublicKeys.filter((k) => k && k !== ctx.myPublicKey);

  if (ctx.type === 'direct' && others.length === 1) {
    return deriveDirectKey(conversationId, privateKey, others[0]);
  }
  const allKeys = ctx.participantPublicKeys.filter(Boolean);
  if (allKeys.length >= 2) {
    return deriveGroupKey(conversationId, allKeys);
  }
  return deriveLegacyKey(conversationId);
}

export async function encryptMessage(
  conversationId: string,
  plaintext: string,
  ctx?: ConversationCryptoContext
): Promise<string> {
  const key = ctx
    ? await deriveConversationKey(conversationId, ctx)
    : await deriveLegacyKey(conversationId);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);
  return btoa(Array.from(combined, (b) => String.fromCharCode(b)).join(''));
}

export async function decryptMessage(
  conversationId: string,
  payload: string,
  ctx?: ConversationCryptoContext
): Promise<string> {
  const keys: CryptoKey[] = [];
  if (ctx) {
    keys.push(await deriveConversationKey(conversationId, ctx));
  }
  keys.push(await deriveLegacyKey(conversationId));

  const combined = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);

  for (const key of keys) {
    try {
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
      return new TextDecoder().decode(decrypted);
    } catch {
      /* try next key */
    }
  }
  return '[Encrypted message]';
}

export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  const pair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );
  const pub = await crypto.subtle.exportKey('spki', pair.publicKey);
  const priv = await crypto.subtle.exportKey('pkcs8', pair.privateKey);
  return {
    publicKey: btoa(Array.from(new Uint8Array(pub), (b) => String.fromCharCode(b)).join('')),
    privateKey: btoa(Array.from(new Uint8Array(priv), (b) => String.fromCharCode(b)).join('')),
  };
}
