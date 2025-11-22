const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';

export const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  let cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  if (isSecure) {
    cookie += '; Secure';
  }
  document.cookie = cookie;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookie = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((row) => row.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split('=')[1]);
};

export const deleteCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
};
