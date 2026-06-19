import type { CollectionConfig } from 'payload'
import { adminsOnly, adminFieldAccess, isAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Team',
  },
  auth: true, // email + password login, sessions, password reset
  access: {
    // Only admins manage the team. Everyone authenticated can read the user list
    // (needed so the admin UI can show authors on content).
    read: ({ req: { user } }) => Boolean(user),
    create: adminsOnly,
    update: ({ req: { user }, id }) => {
      if (isAdmin(user)) return true
      // Non-admins may only edit their own profile.
      return user?.id === id
    },
    delete: adminsOnly,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      // Only admins can grant/change roles, even on their own profile.
      access: {
        create: adminFieldAccess,
        update: adminFieldAccess,
      },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
      ],
    },
  ],
}
