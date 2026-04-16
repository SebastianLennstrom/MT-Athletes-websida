/**
 * Image Carousel Component
 * Modern responsive carousel with auto-play, navigation, and smooth transitions
 */

class ImageCarousel {
    constructor(options = {}) {
        this.containerId = options.containerId || 'carousel';
        this.images = options.images || [];
        this.autoPlay = options.autoPlay !== false; // Default true
        this.autoPlayInterval = options.autoPlayInterval || 5000; // 5 seconds
        this.transition = options.transition || 'fade'; // 'fade' or 'slide'
        this.showThumbnails = options.showThumbnails !== false;
        this.showControls = options.showControls !== false;
        
        this.currentIndex = 0;
        this.autoPlayTimer = null;
        this.container = null;
        this.slides = [];
    }

    /**
     * Initialize carousel
     */
    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`Container with id "${this.containerId}" not found`);
            return;
        }

        this.render();
        this.attachEventListeners();
        
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }

    /**
     * Render carousel HTML structure
     */
    render() {
        const carouselHTML = `
            <div class="carousel-wrapper">
                <div class="carousel-main">
                    <div class="carousel-slides">
                        ${this.images.map((img, idx) => `
                            <div class="carousel-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
                                <img src="${img}" alt="Slide ${idx + 1}" loading="lazy">
                                <div class="carousel-slide-overlay"></div>
                            </div>
                        `).join('')}
                    </div>

                    ${this.showControls ? `
                        <button class="carousel-btn carousel-prev" aria-label="Previous slide">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <button class="carousel-btn carousel-next" aria-label="Next slide">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </button>
                    ` : ''}

                    <div class="carousel-indicators">
                        ${this.images.map((_, idx) => `
                            <button class="carousel-indicator ${idx === 0 ? 'active' : ''}" 
                                    data-index="${idx}" 
                                    aria-label="Go to slide ${idx + 1}"></button>
                        `).join('')}
                    </div>
                </div>

                ${this.showThumbnails ? `
                    <div class="carousel-thumbnails">
                        ${this.images.map((img, idx) => `
                            <button class="carousel-thumbnail ${idx === 0 ? 'active' : ''}" 
                                    data-index="${idx}"
                                    aria-label="Thumbnail ${idx + 1}">
                                <img src="${img}" alt="Thumbnail ${idx + 1}">
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        this.container.innerHTML = carouselHTML;
        this.slides = this.container.querySelectorAll('.carousel-slide');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Navigation buttons
        const prevBtn = this.container.querySelector('.carousel-prev');
        const nextBtn = this.container.querySelector('.carousel-next');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());

        // Indicators
        this.container.querySelectorAll('.carousel-indicator').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.goToSlide(parseInt(e.target.dataset.index));
            });
        });

        // Thumbnails
        this.container.querySelectorAll('.carousel-thumbnail').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.goToSlide(index);
            });
        });

        // Pause on hover
        this.container.querySelector('.carousel-main').addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        this.container.querySelector('.carousel-main').addEventListener('mouseleave', () => {
            if (this.autoPlay) this.startAutoPlay();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Touch/swipe support
        this.addTouchSupport();
    }

    /**
     * Add touch/swipe support
     */
    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;

        const carouselSlides = this.container.querySelector('.carousel-slides');
        
        carouselSlides.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        carouselSlides.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, false);

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) {
                this.next(); // Swipe left
            }
            if (touchEndX > touchStartX + 50) {
                this.prev(); // Swipe right
            }
        };

        this.handleSwipe = handleSwipe;
    }

    /**
     * Go to specific slide
     */
    goToSlide(index) {
        if (index < 0) index = this.images.length - 1;
        if (index >= this.images.length) index = 0;

        this.currentIndex = index;
        this.updateCarousel();
        this.resetAutoPlay();
    }

    /**
     * Next slide
     */
    next() {
        this.goToSlide(this.currentIndex + 1);
    }

    /**
     * Previous slide
     */
    prev() {
        this.goToSlide(this.currentIndex - 1);
    }

    /**
     * Update carousel display
     */
    updateCarousel() {
        // Update slides
        this.slides.forEach((slide, idx) => {
            slide.classList.remove('active');
            if (idx === this.currentIndex) {
                slide.classList.add('active');
            }
        });

        // Update indicators
        this.container.querySelectorAll('.carousel-indicator').forEach((btn, idx) => {
            btn.classList.toggle('active', idx === this.currentIndex);
        });

        // Update thumbnails
        this.container.querySelectorAll('.carousel-thumbnail').forEach((btn, idx) => {
            btn.classList.toggle('active', idx === this.currentIndex);
        });
    }

    /**
     * Start auto-play
     */
    startAutoPlay() {
        this.autoPlayTimer = setInterval(() => {
            this.next();
        }, this.autoPlayInterval);
    }

    /**
     * Stop auto-play
     */
    stopAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    /**
     * Reset auto-play timer
     */
    resetAutoPlay() {
        if (this.autoPlay) {
            this.stopAutoPlay();
            this.startAutoPlay();
        }
    }

    /**
     * Destroy carousel
     */
    destroy() {
        this.stopAutoPlay();
        this.container.innerHTML = '';
    }
}

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageCarousel;
}
