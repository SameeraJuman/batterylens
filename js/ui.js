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

  function buildWidgetCard(device) {
    const isLow = device.battery !== null && device.battery < 20;
    const color = getBatteryColor(device.battery);
    const icon  = getDeviceIcon(device.name);
    const pctText = device.battery !== null ? `${device.battery}%` : '—';

    const card = document.createElement('div');
    card.className = 'widget-card' + (isLow ? ' low-battery' : '');
    card.dataset.deviceId = device.id;

    card.innerHTML = `
      <div class="widget-circle-wrap">
        <svg viewBox="0 0 100 100" width="100" height="100" aria-hidden="true">
          <circle cx="50" cy="50" r="45" fill="none"
                  stroke="var(--border)" stroke-width="8"/>
          <circle class="battery-arc" cx="50" cy="50" r="45" fill="none"
                  stroke="${color}" stroke-width="8"
                  stroke-dasharray="283" stroke-dashoffset="283"/>
        </svg>
        <span class="widget-icon">${icon}</span>
      </div>
      <div class="widget-percent">${pctText}</div>
      <div class="widget-name" title="${device.name}">${device.name}</div>
    `;

    return card;
  }

  function renderWidgetGrid(devices, hidden) {
    widgetSection.classList.remove('d-none');

    const grid = document.getElementById('widget-grid');
    const toggleBtn = document.getElementById('btn-toggle-widgets');
    grid.classList.toggle('d-none', hidden);
    toggleBtn.textContent = hidden ? '▲' : '▼';

    if (hidden) return;

    grid.innerHTML = '';

    devices.forEach(device => {
      const card = buildWidgetCard(device);
      grid.appendChild(card);

      requestAnimationFrame(() => {
        const arc = card.querySelector('.battery-arc');
        const offset = calcArcOffset(device.battery);
        arc.style.setProperty('--target-offset', offset);
        arc.style.animation = 'fillArc 1s ease-out forwards';
      });
    });
  }

  function renderBatteryBar(device) {
    if (device.battery === null) {
      const label = document.createElement('span');
      label.className = 'battery-unsupported';
      label.textContent = 'Battery data not supported by this device';
      return label;
    }
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '8px';

    const track = document.createElement('div');
    track.className = 'battery-bar-track';
    track.style.flex = '1';
    const fill = document.createElement('div');
    fill.className = 'battery-bar-fill';
    fill.style.backgroundColor = getBatteryColor(device.battery);
    track.appendChild(fill);
    requestAnimationFrame(() => {
      fill.style.width = `${device.battery}%`;
    });

    const pct = document.createElement('span');
    pct.textContent = `${device.battery}%`;
    pct.style.fontSize = '0.82rem';
    pct.style.color = getBatteryColor(device.battery);
    pct.style.minWidth = '36px';

    wrap.append(track, pct);
    return wrap;
  }

  function renderDeviceList(devices) {
    listSection.classList.remove('d-none');
    const tbody = document.querySelector('#device-list tbody');
    tbody.innerHTML = '';

    devices.forEach(device => {
      const isLow = device.battery !== null && device.battery < 20;
      const isConnected = device.connected;
      const icon = getDeviceIcon(device.name);
      const timestamp = device.lastSeen ? getRelativeTime(device.lastSeen) : '—';

      const tr = document.createElement('tr');
      tr.className = 'device-row' + (isLow ? ' low-battery' : '');
      tr.dataset.deviceId = device.id;

      // Icon cell
      const tdIcon = document.createElement('td');
      tdIcon.className = 'cell-icon';
      tdIcon.textContent = icon;

      // Name cell
      const tdName = document.createElement('td');
      tdName.className = 'cell-name';
      const nameSpan = document.createElement('span');
      nameSpan.className = 'name-text';
      nameSpan.textContent = device.name;
      tdName.appendChild(nameSpan);

      // Status badge cell
      const tdStatus = document.createElement('td');
      tdStatus.className = 'cell-status';
      const badge = document.createElement('span');
      badge.className = isConnected
        ? 'badge bg-success'
        : 'badge bg-secondary';
      badge.textContent = isConnected ? 'connected' : 'disconnected';
      tdStatus.appendChild(badge);

      // Last seen cell
      const tdLastSeen = document.createElement('td');
      tdLastSeen.className = 'cell-lastseen';
      tdLastSeen.textContent = timestamp;

      // Battery cell
      const tdBattery = document.createElement('td');
      tdBattery.className = 'cell-battery';
      tdBattery.appendChild(renderBatteryBar(device));

      // Trash cell
      const tdTrash = document.createElement('td');
      tdTrash.className = 'cell-trash';
      const trashBtn = document.createElement('button');
      trashBtn.className = 'btn-trash';
      trashBtn.title = 'Remove device';
      trashBtn.innerHTML = '&#x1F5D1;';
      trashBtn.addEventListener('click', () => {
        if (typeof app !== 'undefined' && app.removeDevice) {
          app.removeDevice(device.id);
        }
      });
      tdTrash.appendChild(trashBtn);

      tr.append(tdIcon, tdName, tdStatus, tdLastSeen, tdBattery, tdTrash);
      tbody.appendChild(tr);
    });
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
