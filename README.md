# BatteryLens

**Know your devices. No surprises.**

A single-page web app that tracks Bluetooth device battery levels in one place. Shows a live widget grid and device list, persists last-known battery % so devices stay visible when disconnected, and supports six themes.

Built as my project for the **Learning Hackathon: Spec Driven Development**.

**Built with:** HTML, CSS, JavaScript, Bootstrap 5, Web Bluetooth API

**Note:** Chrome only — Web Bluetooth is not supported in Firefox or Safari.

## Features

- Connect any Bluetooth device and see its battery level
- Widget grid with animated circular battery indicators
- Device list with battery bars, relative timestamps, and inline rename
- Rename any device with a click — original name saved so you can restore it anytime
- 6 themes (Dark, Light, Midnight, Sunset, Forest, Neon)
- Persists last-known battery % across page refreshes
- Auto-reconnects when a device comes back in range

## How to Use

1. Open the app in Chrome (required)
2. Click **Add Device** and select a Bluetooth device from the picker
3. The device appears in the widget grid and device list with its battery level
4. Click a device name to rename it — original name is saved so you can restore it
5. Refresh the page anytime — last-known battery % is remembered

## Known Limitations

- Some devices don't expose battery level via the standard Bluetooth GATT service — these will show as "Battery data not supported by this device"
- Web Bluetooth on Windows can occasionally drop the connection immediately after pairing — turning the device off and back on usually fixes it
- If a device is already actively connected to another device (e.g. your phone), the battery read may fail or return no data — this is a Web Bluetooth limitation, not a bug

## Live App

[batterylens on GitHub Pages](https://sameerajuman.github.io/batterylens/)
