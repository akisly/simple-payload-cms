import type { Access, FieldAccess } from 'payload'

/**
 * Role model for the magazine team:
 *  - admin   : full control, manages users, settings, every edition
 *  - editor  : creates/edits editions, pages, decor, media (the day-to-day team)
 *  - author  : can create/edit content but only publish through an editor
 *
 * Access functions are intentionally small and composable so Phase 2 can extend
 * them (e.g. scoping editors to specific editions) without rewrites.
 *
 * `req.user` is typed loosely here (structural) so these helpers compile before
 * `pnpm generate:types` links the generated User type into `payload`.
 */
type UserLike = { role?: string | null } | null | undefined

export const isAdmin = (user?: UserLike): boolean => user?.role === 'admin'

export const isEditorOrAdmin = (user?: UserLike): boolean =>
  user?.role === 'admin' || user?.role === 'editor'

// --- Collection-level access ---

export const adminsOnly: Access = ({ req: { user } }) => isAdmin(user)

export const editors: Access = ({ req: { user } }) => isEditorOrAdmin(user)

export const anyone: Access = () => true

/**
 * Public read for published content; logged-in team sees drafts too.
 * Works with Payload's drafts/versions feature.
 */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

// --- Field-level access (e.g. only admins can change a user's role) ---

export const adminFieldAccess: FieldAccess = ({ req: { user } }) => isAdmin(user)
