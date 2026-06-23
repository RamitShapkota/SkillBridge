// Lightweight reactive profile store — no external state library needed.
// Settings writes here; profile views read from here.

export interface ProfileData {
  avatarUrl: string; // object URL or data URL of uploaded image; "" = show initials
  name: string;
  bio: string;
  education: string;
  university: string;
  skills: string[];
  github: string;
  linkedin: string;
  portfolio: string;
  email: string;
}

const DEFAULT: ProfileData = {
  avatarUrl: "",
  name: "",
  bio: "",
  education: "",
  university: "",
  skills: [],
  github: "",
  linkedin: "",
  portfolio: "",
  email: "",
};

let _data: ProfileData = { ...DEFAULT };
const _listeners = new Set<() => void>();

export function getProfile(): ProfileData {
  return _data;
}

export function setProfile(partial: Partial<ProfileData>) {
  _data = { ..._data, ...partial };
  _listeners.forEach((fn) => fn());
}

export function subscribeProfile(fn: () => void): () => void {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}
