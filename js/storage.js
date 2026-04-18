const DEVICES_KEY = 'bl_devices';
const PREFS_KEY   = 'bl_prefs';

const storage = {
  getDevices() {
    const raw = localStorage.getItem(DEVICES_KEY);
    if (!raw) return [];
    return JSON.parse(raw).map(d => ({ ...d, connected: false }));
  },

  saveDevice(device) {
    const raw = localStorage.getItem(DEVICES_KEY);
    const all = raw ? JSON.parse(raw) : [];
    const idx = all.findIndex(d => d.id === device.id || d.name === device.name);
    const toSave = { ...device, connected: false };
    if (idx >= 0) {
      // Preserve originalName set on first save — never overwrite it
      toSave.originalName = all[idx].originalName || all[idx].name;
      all[idx] = { ...all[idx], ...toSave };
    } else {
      toSave.originalName = toSave.name;
      all.push(toSave);
    }
    localStorage.setItem(DEVICES_KEY, JSON.stringify(all));
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
