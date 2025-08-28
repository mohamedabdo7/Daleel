// lib/cookies.ts
export const COOKIE_NAMES = {
  TOKEN: "daleel_token",
  REMEMBER_ME: "daleel_remember",
} as const;

export function setCookie(name: string, value: string, days?: number) {
  const expires = days
    ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    : "";
  const expiresStr = expires ? `; expires=${expires}` : "";
  document.cookie = `${name}=${value}${expiresStr}; path=/; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function setAuthToken(token: string, remember: boolean = false) {
  const days = remember ? 30 : undefined; // 30 days if remember me is checked
  setCookie(COOKIE_NAMES.TOKEN, token, days);
  setCookie(COOKIE_NAMES.REMEMBER_ME, remember.toString(), days);
}

export function getAuthToken(): string | null {
  return getCookie(COOKIE_NAMES.TOKEN);
}

export function clearAuthCookies() {
  deleteCookie(COOKIE_NAMES.TOKEN);
  deleteCookie(COOKIE_NAMES.REMEMBER_ME);
}
