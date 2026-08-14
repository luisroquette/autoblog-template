const claimLab = document.querySelector('[data-claim-lab]');
const claimTabs = [...document.querySelectorAll('[data-claim-view]')];
const claimViews = {
  first: { request: 'POST /api/blog/generate', guard: 'Daily claim acquired', outcome: 'One article may publish', code: 'CLAIMED', title: "First execution owns today's slot.", summary: 'The workflow can continue after reserving the date. A later call cannot claim the same schedule twice.', duplicates: '0', blocked: [] },
  retry: { request: 'POST /api/blog/generate', guard: 'Daily claim already exists', outcome: 'Generation skipped', code: 'IDEMPOTENT EXIT', title: 'The retry creates nothing twice.', summary: 'The existing claim closes the duplicate path before text or image generation can begin.', duplicates: '0', blocked: ['guard', 'outcome'] },
  public: { request: 'GET /blog/:slug', guard: "RLS: status = 'published'", outcome: 'Published article returned', code: 'PUBLIC READ', title: 'Drafts stay outside the public query.', summary: 'Anonymous reads can reach published rows. Draft and execution state remain behind the database policy.', duplicates: '—', blocked: [] },
};

const setClaimView = (name, focus = false) => {
  const view = claimViews[name];
  if (!claimLab || !view) return;
  for (const key of ['request', 'guard', 'outcome', 'code', 'title', 'summary', 'duplicates']) {
    claimLab.querySelector(`[data-claim-${key}]`).textContent = view[key];
  }
  claimLab.querySelectorAll('[data-claim-step]').forEach((step) => step.classList.toggle('blocked', view.blocked.includes(step.dataset.claimStep)));
  claimTabs.forEach((tab) => {
    const active = tab.dataset.claimView === name;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active) {
      claimLab.querySelector('#claim-panel')?.setAttribute('aria-labelledby', tab.id);
      if (focus) tab.focus();
    }
  });
};

claimTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => setClaimView(tab.dataset.claimView));
  tab.addEventListener('keydown', (event) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % claimTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + claimTabs.length) % claimTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = claimTabs.length - 1;
    else return;
    event.preventDefault();
    setClaimView(claimTabs[next].dataset.claimView, true);
  });
});

setClaimView('first');
