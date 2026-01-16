export type UserRole = 'admin' | 'editor' | 'viewer'

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 100,
  editor: 50,
  viewer: 10,
}

export class PermissionService {
  // Check if user has required role or higher
  static hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
  }

  // Check if user can edit blogs (editor or admin)
  static canEditBlogs(userRole: UserRole): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY.editor
  }

  // Check if user can manage users (admin only)
  static canManageUsers(userRole: UserRole): boolean {
    return userRole === 'admin'
  }

  // Check if user can delete blogs
  static canDeleteBlogs(userRole: UserRole): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY.editor
  }
}
