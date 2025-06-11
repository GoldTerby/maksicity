document.addEventListener('DOMContentLoaded', function() {
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;
    const totalSlides = slides.length;
    const maxVisibleDots = 10; // Maximum number of dots to display at once

    // Function to create/update dots
    function renderDots() {
        dotsContainer.innerHTML = ''; // Clear existing dots

        let startDot = 0;
        if (totalSlides > maxVisibleDots) {
            // Determine the starting dot index based on the current slide
            startDot = Math.floor(currentIndex / maxVisibleDots) * maxVisibleDots;
        }

        for (let i = 0; i < Math.min(totalSlides, maxVisibleDots); i++) {
            const dotIndex = startDot + i;
            if (dotIndex >= totalSlides) break; // Prevent creating dots for non-existent slides

            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.slide = dotIndex;
            dotsContainer.appendChild(dot);
        }

        // Re-select dots after they've been rendered
        updateDotsState();
    }

    // Function to update the active state of dots
    function updateDotsState() {
        const dots = Array.from(document.querySelectorAll('.dot'));
        dots.forEach(dot => {
            if (parseInt(dot.dataset.slide) === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Function to update the carousel
    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;
        renderDots(); // Re-render dots to ensure correct set is displayed and active state is updated
    }

    // Functions for slide switching
    function showNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Add event listeners for navigation buttons
    nextButton.addEventListener('click', showNextSlide);
    prevButton.addEventListener('click', showPrevSlide);

    // Add event listeners for dynamically created dots using event delegation
    dotsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('dot')) {
            currentIndex = parseInt(event.target.dataset.slide);
            updateCarousel();
        }
    });

    // Initialize carousel
    updateCarousel();

    // NEW CODE FOR ANIMATING DROPDOWNS (не изменилось)
    const residentsDetails = document.querySelector('.residents-dropdown');
    const districtsDetails = document.querySelector('.districts-dropdown');

    function animateDropdownContent(detailsElement) {
        const contentContainer = detailsElement.querySelector('.residents-list') || detailsElement.querySelector('.districts-list');
        if (!contentContainer) return;

        const items = contentContainer.querySelectorAll('.animated-item');

        items.forEach(item => {
            item.classList.remove('slide-in');
            item.style.animationDelay = '';
        });

        if (detailsElement.open) {
            setTimeout(() => {
                items.forEach((item, index) => {
                    item.classList.add('slide-in');
                    item.style.animationDelay = `${index * 0.1}s`;
                });
            }, 50);
        }
    }

    residentsDetails.addEventListener('toggle', () => {
        animateDropdownContent(residentsDetails);
    });

    districtsDetails.addEventListener('toggle', () => {
        animateDropdownContent(districtsDetails);
    });
});