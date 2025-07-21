export function getCookieByName(name: string): string | undefined {
  if (typeof window === "undefined") return undefined;
  const nameLenPlus = name.length + 1;
  return (
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .filter((cookie) => cookie.substring(0, nameLenPlus) === `${name}=`)
      .map((cookie) => decodeURIComponent(cookie.substring(nameLenPlus)))[0] ||
    undefined
  );
}

export function setCookie(
  name: string,
  value: string,
  daysToExpire: number | null = null,
): void {
  const expires = new Date();
  // convert days to milliseconds
  if (daysToExpire) {
    expires.setTime(expires.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
  }

  const cookieValue =
    encodeURIComponent(value) +
    (daysToExpire ? `; expires=${expires.toUTCString()}` : "");

  document.cookie = `${name}=${cookieValue}; path=/`;
}

export function deletedCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
