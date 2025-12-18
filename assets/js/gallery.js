// ===============================
// FILTERING
// ===============================

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const category = item.dataset.category;
      if (filter === 'all' || category === filter) {
        item.style.display = 'block';
        setTimeout(() => item.classList.add('visible'), 10);
      } else {
        item.style.display = 'none';
        item.classList.remove('visible');
      }
    });
  });
});

// ===============================
// LIGHTBOX
// ===============================

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxMeta = document.getElementById('lightboxMeta');
const lightboxTag = document.getElementById('lightboxTag');
const closeBtn = document.querySelector('.lightbox-close');

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    lightbox.classList.add('active');
    lightboxImg.src = item.querySelector('img').src;
    lightboxTitle.textContent = item.querySelector('.gallery-title').textContent;
    lightboxMeta.textContent = item.querySelector('.gallery-meta').textContent;
    lightboxTag.textContent = item.querySelector('.gallery-tag').textContent;
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});
    // Add animation for CTA button
    const ctaButton = document.querySelector('.btn-cta-primary');
    if (ctaButton) {
      ctaButton.addEventListener('mouseenter', () => {
        ctaButton.style.transform = 'translateY(-4px) scale(1.05)';
      });
      
      ctaButton.addEventListener('mouseleave', () => {
        ctaButton.style.transform = 'translateY(0) scale(1)';
      });
    }
    
    // Initialize animations for page load
    window.addEventListener('load', () => {
      // Add floating particles if available
      if (typeof createParticles === 'function') {
        createParticles();
      }
    });