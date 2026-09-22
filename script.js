(() => {
  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const projectCards = [...document.querySelectorAll('.project-card')];
  const projectCount = document.querySelector('#project-count');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let visible = 0;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projectCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category.split(' ').includes(filter);
        card.hidden = !show;
        if (show) visible += 1;
      });
      projectCount.textContent = visible;
    });
  });

  document.querySelectorAll('[data-dialog-open]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const dialog = document.querySelector(`#${trigger.dataset.dialogOpen}`);
      if (dialog) {
        dialog.showModal();
        history.replaceState(null, '', trigger.getAttribute('href'));
      }
    });
  });

  document.querySelectorAll('.project-dialog').forEach((dialog) => {
    dialog.querySelector('[data-dialog-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (window.location.hash === '#soptima') history.replaceState(null, '', window.location.pathname);
    });
  });

  if (window.location.hash === '#soptima') {
    document.querySelector('#soptima-dialog')?.showModal();
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    revealItems.forEach((item) => item.classList.add('reveal-pending'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px' });
    revealItems.forEach((item) => observer.observe(item));

    // Content must never depend on animation support or observer timing.
    window.setTimeout(() => {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }, 1200);
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
