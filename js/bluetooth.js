const bluetooth = (() => {
  // Settable callbacks — app.js assigns these after load
  let onDeviceDisconnected = () => {};
  let onDeviceReconnected  = () => {};

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function readBatteryLevel(server) {
    try {
      const service        = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
      const value          = await characteristic.readValue();
      return value.getUint8(0);
    } catch {
      return null; // device doesn't support battery service
    }
  }

  async function attemptReconnect(device, attemptsLeft) {
    if (attemptsLeft === 0) return;
    await sleep(5000);
    try {
      const server  = await device.gatt.connect();
      const battery = await readBatteryLevel(server);
      onDeviceReconnected(device.id, battery);
      setupDisconnectListener(device); // re-attach after successful reconnect
    } catch {
      attemptReconnect(device, attemptsLeft - 1);
    }
  }

  function setupDisconnectListener(device) {
    // Use a named handler stored on the device object so we can remove it
    // before re-attaching after a successful reconnect — prevents listener stacking.
    if (device._disconnectHandler) {
      device.removeEventListener('gattserverdisconnected', device._disconnectHandler);
    }
    device._disconnectHandler = () => {
      onDeviceDisconnected(device.id);
      attemptReconnect(device, 3);
    };
    device.addEventListener('gattserverdisconnected', device._disconnectHandler);
  }

  // acceptAllDevices so any paired device appears in the picker, not only
  // devices that advertise battery_service in their BLE packets (many don't).
  async function connectNewDevice(onSuccess, onError) {
    let device;
    try {
      device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service']
      });
    } catch (err) {
      // User cancelled the picker or BT unavailable — not a device error
      onError(null, err);
      return;
    }

    try {
      const server  = await device.gatt.connect();
      const battery = await readBatteryLevel(server);
      onSuccess({ id: device.id, name: device.name, battery });
      setupDisconnectListener(device);
    } catch (err) {
      onError(device.id, err);
    }
  }

  return {
    connectNewDevice,
    get onDeviceDisconnected() { return onDeviceDisconnected; },
    set onDeviceDisconnected(fn) { onDeviceDisconnected = fn; },
    get onDeviceReconnected()  { return onDeviceReconnected; },
    set onDeviceReconnected(fn)  { onDeviceReconnected = fn; }
  };
})();
