document.addEventListener('DOMContentLoaded', function() {
    // Карусель (не изменилась)
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0;
    const totalSlides = slides.length;

    // Создаем кружочки-индикаторы динамически
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.slide = i;
        dotsContainer.appendChild(dot);
    }

    const dots = Array.from(document.querySelectorAll('.dot'));

    // Функция для обновления карусели
    function updateCarousel() {
        const offset = -currentIndex * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;

        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Функции для переключения слайдов
    function showNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateCarousel();
    }

    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    // Добавляем "слушателей" событий
    nextButton.addEventListener('click', showNextSlide);
    prevButton.addEventListener('click', showPrevSlide);

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentIndex = parseInt(dot.dataset.slide);
            updateCarousel();
        });
    });

    // Инициализация карусели
    updateCarousel();

    // НОВЫЙ КОД ДЛЯ АНИМАЦИИ ПЛАШЕК

    const residentsDetails = document.querySelector('.residents-dropdown');
    const districtsDetails = document.querySelector('.districts-dropdown');

    function animateDropdownContent(detailsElement) {
        const contentContainer = detailsElement.querySelector('.residents-list') || detailsElement.querySelector('.districts-list');
        if (!contentContainer) return;

        const items = contentContainer.querySelectorAll('p, .district-item');

        // Удаляем класс анимации у всех элементов перед повторным открытием
        // Чтобы анимация сработала каждый раз при открытии
        items.forEach(item => {
            item.classList.remove('slide-in');
            item.style.animationDelay = ''; // Сбросим задержку
        });

        if (detailsElement.open) {
            // Если плашка открывается, добавляем класс анимации с задержкой
            items.forEach((item, index) => {
                // Добавляем класс animated-item, если его нет (для элементов, добавленных динамически)
                if (!item.classList.contains('animated-item')) {
                    item.classList.add('animated-item');
                }
                setTimeout(() => {
                    item.classList.add('slide-in');
                    item.style.animationDelay = `${index * 0.1}s`; // Задержка 0.1s на каждый элемент
                }, 50); // Небольшая задержка, чтобы браузер успел применить сброс стилей
            });
        }
    }

    // Добавляем слушатель событий 'toggle' для каждой плашки
    residentsDetails.addEventListener('toggle', () => {
        animateDropdownContent(residentsDetails);
    });

    districtsDetails.addEventListener('toggle', () => {
        animateDropdownContent(districtsDetails);
    });
});
