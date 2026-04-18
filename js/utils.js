function getRelativeTime(timestamp) {
  const diff = Date.now() - timestamp;
  const min = 60_000, hr = 3_600_000, day = 86_400_000,
        mo = 2_592_000_000, yr = 31_536_000_000;

  if (diff < min)  return 'just now';
  if (diff < hr)   return `${Math.floor(diff / min)} min. ago`;
  if (diff < day)  return `${Math.floor(diff / hr)} hr. ago`;
  if (diff < mo)   return `${Math.floor(diff / day)} days ago`;
  if (diff < yr)   return `${Math.floor(diff / mo)} mo. ago`;
  return `${Math.floor(diff / yr)} yr. ago`;
}

function getBatteryColor(battery) {
  if (battery === null) return 'var(--text-muted)';
  if (battery > 50)  return 'var(--accent-green)';
  if (battery > 20)  return 'var(--accent-yellow)';
  return 'var(--accent-red)';
}

function getDeviceIcon(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('headphone') || n.includes('airpod') ||
      n.includes('wh-') || n.includes('buds') || n.includes('earphone'))
    return '🎧';
  if (n.includes('mouse') || n.includes('mx'))
    return '🖱️';
  if (n.includes('keyboard'))
    return '⌨️';
  if (n.includes('speaker') || n.includes('soundbar'))
    return '🔊';
  return '📱';
}

function calcArcOffset(battery) {
  const circumference = 283;
  if (battery === null) return circumference;
  return circumference * (1 - battery / 100);
}
