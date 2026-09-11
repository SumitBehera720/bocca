/**
 * Central configuration for admin path routing.
 * Easily customized via VITE_ADMIN_PATH environment variable.
 */
export const ADMIN_PATH = (import.meta.env.VITE_ADMIN_PATH || '/secret-admin-portal').replace(/\/+$/, '');
