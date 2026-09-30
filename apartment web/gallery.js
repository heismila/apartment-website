 // ===== Mobile Navigation Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ===== Navbar background on scroll =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// ===== Gallery: Filter + Load More + Lightbox =====
document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const loadMoreBtn = document.getElementById('loadMore');
    let visibleItems = 8;

    // Returns only items matching the currently active filter
    function getFilteredItems() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        return Array.from(galleryItems).filter(item => {
            if (activeFilter === 'all') return true;
            return item.getAttribute('data-category') === activeFilter;
        });
    }

    // Show first `visibleItems` of the filtered set, hide the rest
    function updateVisibleItems() {
        const itemsToShow = getFilteredItems();

        galleryItems.forEach(item => {
            item.style.display = 'none';
            item.classList.add('hidden');
        });

        itemsToShow.forEach((item, index) => {
            if (index < visibleItems) {
                item.style.display = 'block';
                setTimeout(() => item.classList.remove('hidden'), 50);
            }
        });

        if (loadMoreBtn) {
            loadMoreBtn.style.display = visibleItems >= itemsToShow.length ? 'none' : 'inline-block';
        }
    }

    // Filter button clicks
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            visibleItems = 8;
            updateVisibleItems();
        });
    });

    // Load More click
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            visibleItems += 8;
            updateVisibleItems();
        });
    }

    // Lightbox on image click
    galleryItems.forEach(item => {
        item.addEventListener('click', function () {
            const img = this.querySelector('img');
            if (img) openLightbox(img.src, img.alt);
        });
    });

    function openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                <span class="lightbox-close">&times;</span>
                <div class="lightbox-caption">${alt}</div>
            </div>
        `;
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                document.body.removeChild(lightbox);
            }
        });

        document.addEventListener('keydown', function closeOnEsc(e) {
            if (e.key === 'Escape') {
                if (document.body.contains(lightbox)) {
                    document.body.removeChild(lightbox);
                }
                document.removeEventListener('keydown', closeOnEsc);
            }
        });
    }

    // Initial render
    updateVisibleItems();
});

// ===== Lightbox styles (injected once) =====
(function injectLightboxStyles() {
    if (document.getElementById('lightbox-styles')) return;
    const style = document.createElement('style');
    style.id = 'lightbox-styles';
    style.textContent = `
        .lightbox {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex; align-items: center; justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        .lightbox-content {
            position: relative; max-width: 90%; max-height: 90%;
        }
        .lightbox-content img {
            max-width: 100%; max-height: 80vh;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .lightbox-close {
            position: absolute; top: -40px; right: 0;
            color: white; font-size: 2rem; cursor: pointer;
            background: rgba(0,0,0,0.5);
            width: 40px; height: 40px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
        }
        .lightbox-close:hover { background: rgba(255,255,255,0.2); }
        .lightbox-caption {
            color: white; text-align: center;
            margin-top: 1rem; font-size: 1.1rem;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    `;
    document.head.appendChild(style);
})();