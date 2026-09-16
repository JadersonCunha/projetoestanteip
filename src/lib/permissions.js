export const ADMIN_EMAIL = 'jaderson.cunha@redeicm.org.br';

export function normalizeEmail(email) {
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}

export function isAdminEmail(email) {
  return normalizeEmail(email) === ADMIN_EMAIL;
}
