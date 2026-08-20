export const ROLES = {
  EDITOR: "EDITOR",
  PUBLISHER: "PUBLISHER",
  ADMIN: "ADMIN",
};

export const ROLE_LABELS = {
  EDITOR: "Editor",
  PUBLISHER: "Publisher",
  ADMIN: "Admin",
};

export function canManageUsers(role) {
  return role === ROLES.ADMIN;
}

export function isStaffRole(role) {
  return role === ROLES.EDITOR || role === ROLES.PUBLISHER || role === ROLES.ADMIN;
}
