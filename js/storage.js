const DEVICES_KEY = 'bl_devices';
const PREFS_KEY   = 'bl_prefs';

const storage = {
  getDevices() {
    const raw = localStorage.getItem(DEVICES_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map(d => ({ ...d, connected: false }));
  },

  saveDevice(device) {
    const devices = this.getDevices();
    const idx = devices.findIndex(d => d.id === device.id);
    const toSave = { ...device, connected: false };
    if (idx >= 0) {
      devices[idx] = toSave;
    } else {
      devices.push(toSave);
    }
    localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
  },

  removeDevice(id) {
    const devices = this.getDevices().filter(d => d.id !== id);
    localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
  },

  getPrefs() {
    const raw = localStorage.getItem(PREFS_KEY);
    const defaults = { theme: 'dark', widgetsHidden: false };
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  },

  savePrefs(partial) {
    const current = this.getPrefs();
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...partial }));
  }
};
