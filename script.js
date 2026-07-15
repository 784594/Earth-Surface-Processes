const progressBar = document.querySelector('.scroll-progress');
const revealItems = document.querySelectorAll('.reveal');
const pageMapLinks = document.querySelectorAll('[data-section-link]');
const sections = document.querySelectorAll('section[id]');

// IMAGE GUIDE: add a file to images/, then add or update its matching path here.
// Every data-image-slot in index.html uses object-fit: cover, so mixed image sizes
// fill their cards without stretching. Leave a slot out to keep its placeholder.
const imageSlots = {
  runoff: 'images/Water Runoff.png',
  'channel-cutting': 'images/Channel Cutting.png',
  discharge: 'images/Discharge.png',
  'curving-flow': 'images/Curving Flow.png',
  'erosion-deposition': 'images/Stream Controling Erosion and Deposition.png',
  'niagara-gorge': 'images/World Atlas Niagara Gorge.jpg',
  'overbank-flooding': 'images/Overbank Flooding.png',
  'grand-canyon': 'images/colorado.river_.grand_.canyon.oars_.jpg',
};

document.querySelectorAll('[data-image-slot]').forEach((slot) => {
  const source = imageSlots[slot.dataset.imageSlot];
  if (!source) return;

  const placeholder = slot.innerHTML;
  const placeholderLabel = slot.getAttribute('aria-label');
  const image = document.createElement('img');
  image.src = source;
  image.alt = slot.dataset.imageAlt || '';
  image.loading = 'lazy';
  image.addEventListener('error', () => {
    slot.innerHTML = placeholder;
    slot.classList.remove('has-image');
    slot.setAttribute('role', 'img');
    if (placeholderLabel) slot.setAttribute('aria-label', placeholderLabel);
  });
  slot.replaceChildren(image);
  slot.classList.add('has-image');
  slot.removeAttribute('role');
  slot.removeAttribute('aria-label');
});

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
