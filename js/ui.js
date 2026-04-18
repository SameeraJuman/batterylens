const ui = (() => {
  const emptyState      = document.getElementById('empty-state');
  const widgetSection   = document.getElementById('widget-section');
  const listSection     = document.getElementById('list-section');
  const btnAddDevice    = document.getElementById('btn-add-device');
  const btnAddEmpty     = document.getElementById('btn-add-device-empty');

  function showEmptyState() {
    emptyState.classList.remove('d-none');
    btnAddDevice.classList.add('d-none');
    widgetSection.classList.add('d-none');
    listSection.classList.add('d-none');
  }

  function hideEmptyState() {
    emptyState.classList.add('d-none');
    btnAddDevice.classList.remove('d-none');
    widgetSection.classList.remove('d-none');
    listSection.classList.remove('d-none');
  }

  function showConnectingState() {
    btnAddDevice.textContent = 'Connecting…';
    btnAddDevice.disabled = true;
    btnAddEmpty.textContent = 'Connecting…';
    btnAddEmpty.disabled = true;
  }

  function hideConnectingState() {
    btnAddDevice.textContent = '+ Add Device';
    btnAddDevice.disabled = false;
    btnAddEmpty.textContent = '+ Add Device';
    btnAddEmpty.disabled = false;
  }

  function showErrorCard(deviceId) {
    hideConnectingState();
    console.warn('Connection error for device:', deviceId);
  }

  function sortDevices(devices) {
    return [...devices].sort((a, b) => {
      if (a.battery === null) return 1;
      if (b.battery === null) return -1;
      return a.battery - b.battery;
    });
  }

  function renderWidgetGrid(devices, hidden) {
    // stub — implemented in step 6
    widgetSection.classList.toggle('d-none', hidden);
  }

  function renderDeviceList(devices) {
    // stub — implemented in step 7
    listSection.classList.remove('d-none');
  }

  function render(devices, prefs) {
    if (devices.length === 0) {
      showEmptyState();
      return;
    }
    hideEmptyState();
    hideConnectingState();
    const sorted = sortDevices(devices);
    renderWidgetGrid(sorted, prefs.widgetsHidden);
    renderDeviceList(sorted);
  }

  return {
    showEmptyState,
    hideEmptyState,
    showConnectingState,
    hideConnectingState,
    showErrorCard,
    render
  };
})();
