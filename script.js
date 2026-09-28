(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

  const setMenu = (open) => {
    if (!menuButton || !navigation || !header) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.querySelector('.sr-only').textContent = open ? 'Close navigation' : 'Open navigation';
    navigation.classList.toggle('is-open', open);
    header.classList.toggle('menu-active', open);
    document.body.classList.toggle('menu-open', open);
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 930) setMenu(false);
  });

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const repositoryItems = [...document.querySelectorAll('[data-repository-item]')];
  const repositorySearch = document.querySelector('#repository-search');
  const projectCount = document.querySelector('#project-count');
  const emptyState = document.querySelector('#repository-empty');
  let activeFilter = 'all';

  const normalise = (value) => value
    .toLocaleLowerCase('en')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const updateRepositories = () => {
    const query = normalise(repositorySearch?.value || '');
    let visible = 0;

    repositoryItems.forEach((item) => {
      const categories = item.dataset.category?.split(' ') || [];
      const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
      const matchesSearch = !query || normalise(item.textContent).includes(query);
      const show = matchesFilter && matchesSearch;
      item.hidden = !show;
      if (show) visible += 1;
    });

    if (projectCount) projectCount.textContent = String(visible);
    if (emptyState) emptyState.hidden = visible !== 0;
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filterButtons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle('is-active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });
      updateRepositories();
    });
  });

  repositorySearch?.addEventListener('input', updateRepositories);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = [...document.querySelectorAll('.reveal')];

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    revealItems.forEach((item) => item.classList.add('reveal-pending'));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -28px' });

    revealItems.forEach((item) => revealObserver.observe(item));
    window.setTimeout(() => revealItems.forEach((item) => item.classList.add('is-visible')), 1400);
  }

  if ('IntersectionObserver' in window) {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleSections.length) return;
      const activeId = `#${visibleSections[0].target.id}`;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === activeId;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: [0, .1, .3] });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
