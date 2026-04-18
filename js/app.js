// placeholder for steps 5+ — theme swatches wired early for step 1 verification
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('theme-swatches').addEventListener('click', (e) => {
    const swatch = e.target.closest('.theme-swatch');
    if (swatch) {
      document.body.className = `theme-${swatch.dataset.theme}`;
    }
  });
});
