/** `Authorization: Bearer <token>` 에서 토큰만 추출 */
export function extractBearerToken(
  authHeader: string | string[] | undefined,
): string | null {
  if (!authHeader || Array.isArray(authHeader)) {
    return null;
  }
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : authHeader.trim() || null;
}
