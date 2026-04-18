document.addEventListener('DOMContentLoaded', () => {
  const devices = storage.getDevices();
  const prefs   = storage.getPrefs();
  applyTheme(prefs.theme);
  ui.render(devices, prefs);
  bindEvents();

  bluetooth.onDeviceDisconnected = (id) => {
    const all = storage.getDevices();
    const device = all.find(d => d.id === id);
    if (device) {
      device.connected = false;
      storage.saveDevice(device);
      ui.render(storage.getDevices(), storage.getPrefs());
    }
  };

  bluetooth.onDeviceReconnected = (id, battery) => {
    const all = storage.getDevices();
    const device = all.find(d => d.id === id);
    if (device) {
      device.battery  = battery;
      device.connected = true;
      device.lastSeen = Date.now();
      storage.saveDevice(device);
      ui.render(storage.getDevices(), storage.getPrefs());
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
  ui.render(storage.getDevices(), storage.getPrefs());
}

async function handleAddDevice() {
  ui.showConnectingState();
  await bluetooth.connectNewDevice(
    ({ id, name, battery }) => {
      const device = { id, name, battery, lastSeen: Date.now(), connected: true };
      storage.saveDevice(device);
      ui.render(storage.getDevices(), storage.getPrefs());
    },
    (id, err) => {
      ui.showErrorCard(id);
    }
  );
}

function bindEvents() {
  document.getElementById('btn-add-device-empty').addEventListener('click', handleAddDevice);
  document.getElementById('btn-add-device').addEventListener('click', handleAddDevice);

  document.getElementById('theme-swatches').addEventListener('click', (e) => {
    const swatch = e.target.closest('.theme-swatch');
    if (swatch) applyTheme(swatch.dataset.theme);
  });

  document.getElementById('btn-toggle-widgets').addEventListener('click', toggleWidgets);
}
