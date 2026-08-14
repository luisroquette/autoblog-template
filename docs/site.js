const copyButton = document.querySelector('[data-copy]');

copyButton?.addEventListener('click', async () => {
  const original = copyButton.textContent;
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copy);
    copyButton.textContent = 'Copied to clipboard';
  } catch {
    copyButton.textContent = 'Copy failed — use GitHub';
  }
  window.setTimeout(() => {
    copyButton.textContent = original;
  }, 1800);
});
