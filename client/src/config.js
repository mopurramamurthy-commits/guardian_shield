export const DEFAULT_CONFIG = {
  // Hardcoded permanent Google Drive Web App URL
  scriptUrl: 'https://script.google.com/macros/s/AKfycbxCTJutnn0xMRTPhrxujrTCfsa_EzzO5gnA2QKDh_xf_aiq1qdjQuEbBRPSCs6YnO4VeA/exec',
  authToken: 'GUARDIAN_SECURE_TOKEN_98234',
  pollingIntervalMs: 8000,
  demoMode: false
};

export const STORAGE_KEYS = {
  SCRIPT_URL: 'gs_script_url',
  AUTH_TOKEN: 'gs_auth_token',
  DEMO_MODE: 'gs_demo_mode',
  ACTIVE_DEVICE_ID: 'gs_active_device_id',
  LOCAL_DATA: 'gs_local_simulator_data'
};
