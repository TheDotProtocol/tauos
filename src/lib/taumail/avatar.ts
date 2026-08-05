/** Gravatar + Gmail-style initials for mail contact avatars */

const GMAIL_COLORS = [
  '#1a73e8',
  '#d93025',
  '#188038',
  '#e37400',
  '#9334e6',
  '#007b83',
  '#c5221f',
  '#137333',
  '#5f6368',
  '#a142f4',
] as const;

function md5(input: string): string {
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = (a + q + x + t) | 0;
    return (((a << s) | (a >>> (32 - s))) + b) | 0;
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  const bytes = new TextEncoder().encode(input);
  const bitLen = bytes.length * 8;
  const padded = new Uint8Array(((bytes.length + 8) >> 6) * 64 + 64);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, bitLen, true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  for (let i = 0; i < padded.length; i += 64) {
    const m = new Int32Array(16);
    for (let j = 0; j < 16; j++) m[j] = view.getInt32(i + j * 4, true);

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    a = ff(a, b, c, d, m[0], 7, -680876936);
    d = ff(d, a, b, c, m[1], 12, -389564586);
    c = ff(c, d, a, b, m[2], 17, 606105819);
    b = ff(b, c, d, a, m[3], 22, -1044525330);
    a = ff(a, b, c, d, m[4], 7, -176418897);
    d = ff(d, a, b, c, m[5], 12, 1200080426);
    c = ff(c, d, a, b, m[6], 17, -1473231341);
    b = ff(b, c, d, a, m[7], 22, -45705983);
    a = ff(a, b, c, d, m[8], 7, 1770035416);
    d = ff(d, a, b, c, m[9], 12, -1958414417);
    c = ff(c, d, a, b, m[10], 17, -42063);
    b = ff(b, c, d, a, m[11], 22, -1990404162);
    a = ff(a, b, c, d, m[12], 7, 1804603682);
    d = ff(d, a, b, c, m[13], 12, -40341101);
    c = ff(c, d, a, b, m[14], 17, -1502002290);
    b = ff(b, c, d, a, m[15], 22, 1236535329);

    a = gg(a, b, c, d, m[1], 5, -165796510);
    d = gg(d, a, b, c, m[6], 9, -1069501632);
    c = gg(c, d, a, b, m[11], 14, 643717713);
    b = gg(b, c, d, a, m[0], 20, -373897302);
    a = gg(a, b, c, d, m[5], 5, -701558691);
    d = gg(d, a, b, c, m[10], 9, 38016083);
    c = gg(c, d, a, b, m[15], 14, -660478335);
    b = gg(b, c, d, a, m[4], 20, -405537848);
    a = gg(a, b, c, d, m[9], 5, 568446438);
    d = gg(d, a, b, c, m[14], 9, -1019803690);
    c = gg(c, d, a, b, m[3], 14, -187363961);
    b = gg(b, c, d, a, m[8], 20, 1163531501);
    a = gg(a, b, c, d, m[13], 5, -1444681467);
    d = gg(d, a, b, c, m[2], 9, -51403784);
    c = gg(c, d, a, b, m[7], 14, 1735328473);
    b = gg(b, c, d, a, m[12], 20, -1926607734);

    a = hh(a, b, c, d, m[5], 4, -378558);
    d = hh(d, a, b, c, m[8], 11, -2022574463);
    c = hh(c, d, a, b, m[11], 16, 1839030562);
    b = hh(b, c, d, a, m[14], 23, -35309556);
    a = hh(a, b, c, d, m[1], 4, -1530992060);
    d = hh(d, a, b, c, m[4], 11, 1272893353);
    c = hh(c, d, a, b, m[7], 16, -155497632);
    b = hh(b, c, d, a, m[10], 23, -1094730640);
    a = hh(a, b, c, d, m[13], 4, 681279174);
    d = hh(d, a, b, c, m[0], 11, -358537222);
    c = hh(c, d, a, b, m[3], 16, -722521979);
    b = hh(b, c, d, a, m[6], 23, 76029189);
    a = hh(a, b, c, d, m[9], 4, -640364487);
    d = hh(d, a, b, c, m[12], 11, -421815835);
    c = hh(c, d, a, b, m[15], 16, 530742520);
    b = hh(b, c, d, a, m[2], 23, -995338651);

    a = ii(a, b, c, d, m[0], 6, -198630844);
    d = ii(d, a, b, c, m[7], 10, 1126891415);
    c = ii(c, d, a, b, m[14], 15, -1416354905);
    b = ii(b, c, d, a, m[5], 21, -57434055);
    a = ii(a, b, c, d, m[12], 6, 1700485571);
    d = ii(d, a, b, c, m[3], 10, -1894986606);
    c = ii(c, d, a, b, m[10], 15, -1051523);
    b = ii(b, c, d, a, m[1], 21, -2054922799);
    a = ii(a, b, c, d, m[8], 6, 1873313359);
    d = ii(d, a, b, c, m[15], 10, -30611744);
    c = ii(c, d, a, b, m[6], 15, -1560198380);
    b = ii(b, c, d, a, m[13], 21, 1309151649);
    a = ii(a, b, c, d, m[4], 6, -145523070);
    d = ii(d, a, b, c, m[11], 10, -1120210379);
    c = ii(c, d, a, b, m[2], 15, 718787259);
    b = ii(b, c, d, a, m[9], 21, -343485551);

    a0 = (a0 + a) | 0;
    b0 = (b0 + b) | 0;
    c0 = (c0 + c) | 0;
    d0 = (d0 + d) | 0;
  }

  const toHex = (n: number) => {
    const s = (n >>> 0).toString(16);
    return '00000000'.slice(s.length) + s;
  };
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function gravatarUrl(email: string, size = 80): string {
  const hash = md5(normalizeEmail(email));
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=404`;
}

export function avatarBackgroundColor(email: string): string {
  let hash = 0;
  const normalized = normalizeEmail(email);
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GMAIL_COLORS[Math.abs(hash) % GMAIL_COLORS.length];
}

export function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}
