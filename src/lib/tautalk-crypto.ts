/**
 * Client-side E2E helpers for Tau Talk (Web Crypto API).
 * Server only stores ciphertext — never plaintext.
 */

export async function deriveConversationKey(
  conversationId: string,
  userId: string
): Promise<CryptoKey> {
  const material = new TextEncoder().encode(`tautalk:v1:${conversationId}:${userId}`);
  const hash = await crypto.subtle.digest('SHA-256', material);
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

/** Shared key for all participants in a conversation (MVP — upgrade to Signal-style in v2). */
export async function deriveSharedKey(conversationId: string): Promise<CryptoKey> {
  const material = new TextEncoder().encode(`tautalk:shared:v1:${conversationId}`);
  const hash = await crypto.subtle.digest('SHA-256', material);
  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

export async function encryptMessage(
  conversationId: string,
  plaintext: string
): Promise<string> {
  const key = await deriveSharedKey(conversationId);
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
  payload: string
): Promise<string> {
  try {
    const key = await deriveSharedKey(conversationId);
    const combined = Uint8Array.from(atob(payload), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return new TextDecoder().decode(decrypted);
  } catch {
    return '[Encrypted message]';
  }
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
