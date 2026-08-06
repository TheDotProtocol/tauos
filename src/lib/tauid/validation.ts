const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_]{3,32}$/;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateEmail(email: string): string | null {
  const normalized = normalizeEmail(email);
  if (!normalized) return 'Email is required';
  if (!EMAIL_RE.test(normalized)) return 'Enter a valid email address';
  return null;
}

export function validateUsername(username: string): string | null {
  const trimmed = username.trim();
  if (!trimmed) return 'Username is required';
  if (!USERNAME_RE.test(trimmed)) {
    return 'Username must be 3–32 characters (letters, numbers, underscore)';
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must include at least one letter and one number';
  }
  return null;
}

export function validateFullName(fullName: string): string | null {
  const trimmed = fullName.trim();
  if (!trimmed) return 'Full name is required';
  if (trimmed.length < 2) return 'Enter your full name';
  return null;
}

export function validateRegisterInput(input: {
  email: string;
  password: string;
  username: string;
  fullName: string;
}): string | null {
  return (
    validateFullName(input.fullName) ||
    validateUsername(input.username) ||
    validateEmail(input.email) ||
    validatePassword(input.password)
  );
}
