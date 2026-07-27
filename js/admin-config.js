/* ============================================================
   Micah Guevarra Portfolio — Admin configuration
   ------------------------------------------------------------
   Holds the SHA-256 hash of the admin password used to access
   the hidden admin mode for visitor-feedback moderation.

   To change the password:
     1. Hash the new password:
          node -e "console.log(require('crypto').createHash('sha256').update('YourNewPassword').digest('hex'))"
     2. Paste the resulting hex digest below, replacing passwordHash.

   Auth state (30-minute expiry after each unlock) is stored in
   localStorage under "micah-portfolio-admin-authed".
   ============================================================ */

(function () {
  window.ADMIN_CONFIG = Object.freeze({
    // SHA-256("Password-1a") — case-sensitive.
    passwordHash: '5a638872c938c0f0ee0d9ae3c0473dfbffc0f8510dda0bda92ea6b4a020b57a4',
    // Auth expires 30 minutes after last successful unlock.
    authTtlMs: 30 * 60 * 1000,
    // localStorage key for the authed timestamp.
    authStorageKey: 'micah-portfolio-admin-authed',
  });
})();