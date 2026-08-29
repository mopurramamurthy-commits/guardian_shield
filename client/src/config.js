export const DEFAULT_CONFIG = {
  // Google Apps Script Webhook URL (saved in localStorage once configured)
  scriptUrl: localStorage.getItem('gs_script_url') || '',
  authToken: localStorage.getItem('gs_auth_token') || 'GUARDIAN_SECURE_TOKEN_98234',
  pollingIntervalMs: 8000, // auto-refresh from Google Drive every 8 seconds
  demoMode: localStorage.getItem('gs_demo_mode') === null ? true : localStorage.getItem('gs_demo_mode') === 'true'
};

export const STORAGE_KEYS = {
  SCRIPT_URL: 'gs_script_url',
  AUTH_TOKEN: 'gs_auth_token',
  DEMO_MODE: 'gs_demo_mode',
  LOCAL_DATA: 'gs_local_simulator_data'
};
