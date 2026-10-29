/**
 * Returns the profile URL for a user given their username or uid.
 * In Next.js static exports (`output: export`), dynamic routes like `/profile/[username]`
 * do not have RSC payload files pre-generated for every arbitrary user, causing Next.js
 * Link prefetch (`_rsc`) requests to 404 in the browser console.
 * 
 * Using `/profile?username=...` or `/profile?id=...` renders the static `/profile` page
 * which client-loads the user's data cleanly without any 404 prefetch requests.
 */
export function getUserProfileUrl(user?: { username?: string | null; uid?: string | null; id?: string | null } | null): string {
  if (!user) return '/profile';
  if (user.username && user.username.trim() !== '') {
    return `/profile?username=${encodeURIComponent(user.username.trim())}`;
  }
  const id = user.uid || user.id;
  if (id && id.trim() !== '') {
    return `/profile?id=${encodeURIComponent(id.trim())}`;
  }
  return '/profile';
}
