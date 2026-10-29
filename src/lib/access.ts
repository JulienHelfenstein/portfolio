export const ACCESS_COOKIE = "portfolio_access";

/** Valeur stockée dans le cookie : empreinte du jeton, jamais le jeton lui-même. */
export async function accessDigest(token: string): Promise<string> {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`portfolio:${token}`));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}
