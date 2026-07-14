const progressBar = document.querySelector('.scroll-progress');
const revealItems = document.querySelectorAll('.reveal');
const pageMapLinks = document.querySelectorAll('[data-section-link]');
const sections = document.querySelectorAll('section[id]');

const updateProgress = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;
};

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  },
  {
    threshold: 0.16,
    rootMargin: '0px 0px -60px 0px',
  },
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSections = entries.filter((entry) => entry.isIntersecting);
    if (!visibleSections.length) {
      return;
    }

    visibleSections.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    const activeId = visibleSections[0].target.id;

    pageMapLinks.forEach((link) => {
      const isActive = link.dataset.sectionLink === activeId;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  },
  {
    threshold: [0.15, 0.3, 0.6],
    rootMargin: '0px 0px -40% 0px',
  },
);

revealItems.forEach((item) => observer.observe(item));
sections.forEach((section) => sectionObserver.observe(section));
updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
