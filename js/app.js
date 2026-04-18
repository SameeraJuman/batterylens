// Runtime set — tracks which device ids are connected this session only.
// Not persisted: on reload all devices start disconnected regardless of prior state.
const connectedIds = new Set();

function getDevicesWithStatus() {
  return storage.getDevices().map(d => ({ ...d, connected: connectedIds.has(d.id) }));
}

document.addEventListener('DOMContentLoaded', () => {
  const prefs = storage.getPrefs();
  applyTheme(prefs.theme);
  ui.render(getDevicesWithStatus(), prefs);
  bindEvents();

  bluetooth.onDeviceDisconnected = (id) => {
    connectedIds.delete(id);
    ui.render(getDevicesWithStatus(), storage.getPrefs());
  };

  bluetooth.onDeviceReconnected = (id, battery) => {
    const all = storage.getDevices();
    const device = all.find(d => d.id === id);
    if (device) {
      device.battery  = battery;
      device.lastSeen = Date.now();
      storage.saveDevice(device);
      connectedIds.add(id);
      ui.render(getDevicesWithStatus(), storage.getPrefs());
    }
  };
});

function applyTheme(name) {
  document.body.className = `theme-${name}`;
  storage.savePrefs({ theme: name });
}

function toggleWidgets() {
  const prefs = storage.getPrefs();
  storage.savePrefs({ widgetsHidden: !prefs.widgetsHidden });
  ui.render(getDevicesWithStatus(), storage.getPrefs());
}

async function handleAddDevice() {
  ui.showConnectingState();
  await bluetooth.connectNewDevice(
    ({ id, name, battery }) => {
      const device = { id, name, battery, lastSeen: Date.now() };
      storage.saveDevice(device);
      connectedIds.add(id);
      ui.render(getDevicesWithStatus(), storage.getPrefs());
    },
    (id, err) => {
      ui.showErrorCard(id);
    }
  );
}

function removeDevice(id) {
  connectedIds.delete(id);
  storage.removeDevice(id);
  ui.render(getDevicesWithStatus(), storage.getPrefs());
}

function updateNickname(id, value) {
  const all = storage.getDevices();
  const device = all.find(d => d.id === id);
  if (device) {
    device.name = value;
    storage.saveDevice(device);
    ui.render(getDevicesWithStatus(), storage.getPrefs());
  }
}

const app = { removeDevice, updateNickname };

function bindEvents() {
  document.getElementById('btn-add-device-empty').addEventListener('click', handleAddDevice);
  document.getElementById('btn-add-device').addEventListener('click', handleAddDevice);

  document.getElementById('theme-swatches').addEventListener('click', (e) => {
    const swatch = e.target.closest('.theme-swatch');
    if (swatch) applyTheme(swatch.dataset.theme);
  });

  document.getElementById('btn-toggle-widgets').addEventListener('click', toggleWidgets);
}
