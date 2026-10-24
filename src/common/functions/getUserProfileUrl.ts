/**
 * Returns the profile URL for a user given their username or uid.
 * Prioritizes username for clean URLs (/profile/username) and falls back to /profile?id=uid or /profile.
 */
export function getUserProfileUrl(user?: { username?: string | null; uid?: string | null; id?: string | null } | null): string {
  if (!user) return '/profile';
  if (user.username && user.username.trim() !== '') {
    return `/profile/${encodeURIComponent(user.username.trim())}`;
  }
  const id = user.uid || user.id;
  if (id && id.trim() !== '') {
    return `/profile?id=${encodeURIComponent(id.trim())}`;
  }
  return '/profile';
}
