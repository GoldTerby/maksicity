document.addEventListener('DOMContentLoaded', function() {
    // Получаем необходимые элементы карусели
    const carouselTrack = document.querySelector('.carousel-track');
    // Преобразуем NodeList в массив для удобной работы
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0; // Текущий индекс активного слайда
    const totalSlides = slides.length; // Общее количество слайдов
    const maxVisibleDots = 10; // Максимальное количество отображаемых кружочков-индикаторов

    /**
     * Функция для создания и обновления кружочков-индикаторов.
     * Она динамически очищает и перерисовывает кружочки в зависимости от
     * общего количества слайдов и текущего индекса.
     */
    function renderDots() {
        dotsContainer.innerHTML = ''; // Очищаем контейнер от старых кружочков

        let startDot = 0;
        // Если слайдов больше, чем максимальное количество видимых кружочков,
        // вычисляем начальный индекс для отображаемого блока кружочков.
        if (totalSlides > maxVisibleDots) {
            startDot = Math.floor(currentIndex / maxVisibleDots) * maxVisibleDots;
        }

        // Создаем кружочки. Отображаем либо все кружочки (если их <= maxVisibleDots),
        // либо только maxVisibleDots начиная с calculated startDot.
        for (let i = 0; i < Math.min(totalSlides, maxVisibleDots); i++) {
            const dotIndex = startDot + i;
            // Предотвращаем создание кружочков для несуществующих слайдов
            if (dotIndex >= totalSlides) break;

            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.slide = dotIndex; // Сохраняем индекс слайда в атрибуте data-slide
            dotsContainer.appendChild(dot);
        }

        // После рендеринга кружочков, обновляем их активное состояние
        updateDotsState();
    }

    /**
     * Функция для обновления активного состояния кружочков-индикаторов.
     * Она перебирает все кружочки и устанавливает класс 'active' для текущего.
     */
    function updateDotsState() {
        const dots = Array.from(document.querySelectorAll('.dot')); // Получаем все кружочки заново
        dots.forEach(dot => {
            if (parseInt(dot.dataset.slide) === currentIndex) {
                dot.classList.add('active'); // Делаем текущий кружочек активным
            } else {
                dot.classList.remove('active'); // Деактивируем остальные кружочки
            }
        });
    }

    /**
     * Основная функция для обновления состояния карусели (позиции слайдов и кружочков).
     */
    function updateCarousel() {
        // Вычисляем смещение для трека карусели, чтобы показать текущий слайд
        const offset = -currentIndex * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;
        // Перерисовываем и обновляем состояние кружочков
        renderDots();
    }

    /**
     * Переход к следующему слайду.
     */
    function showNextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides; // Переключаемся на следующий слайд, зацикливая
        updateCarousel(); // Обновляем карусель
    }

    /**
     * Переход к предыдущему слайду.
     */
    function showPrevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides; // Переключаемся на предыдущий слайд, зацикливая
        updateCarousel(); // Обновляем карусель
    }

    // Добавляем слушателей событий для кнопок навигации
    nextButton.addEventListener('click', showNextSlide);
    prevButton.addEventListener('click', showPrevSlide);

    // Добавляем слушателя событий для контейнера с кружочками (делегирование событий).
    // Это позволяет обрабатывать клики по динамически создаваемым кружочкам.
    dotsContainer.addEventListener('click', function(event) {
        // Проверяем, был ли клик по элементу с классом 'dot'
        if (event.target.classList.contains('dot')) {
            currentIndex = parseInt(event.target.dataset.slide); // Устанавливаем текущий слайд на основе data-slide
            updateCarousel(); // Обновляем карусель
        }
    });

    // Инициализация карусели при загрузке страницы
    updateCarousel();

    // КОД ДЛЯ АНИМАЦИИ РАСКРЫВАЮЩИХСЯ ПЛАШЕК (не изменился)

    const residentsDetails = document.querySelector('.residents-dropdown');
    const districtsDetails = document.querySelector('.districts-dropdown');

    /**
     * Функция для анимации контента раскрывающихся плашек.
     * @param {HTMLElement} detailsElement Элемент <details>, который нужно анимировать.
     */
    function animateDropdownContent(detailsElement) {
        // Находим контейнер с контентом внутри плашки
        const contentContainer = detailsElement.querySelector('.residents-list') || detailsElement.querySelector('.districts-list');
        if (!contentContainer) return; // Если контент не найден, выходим

        // Выбираем все анимируемые элементы внутри контейнера
        const items = contentContainer.querySelectorAll('.animated-item');

        // Сначала удаляем классы анимации и сбрасываем задержку,
        // чтобы анимация могла быть запущена снова при повторном открытии.
        items.forEach(item => {
            item.classList.remove('slide-in');
            item.style.animationDelay = ''; // Сброс индивидуальной задержки
        });

        if (detailsElement.open) {
            // Если плашка открывается
            // Используем setTimeout, чтобы гарантировать, что класс 'slide-in'
            // добавляется после того, как браузер обработал удаление классов.
            // Это обеспечивает корректный запуск анимации.
            setTimeout(() => {
                items.forEach((item, index) => {
                    item.classList.add('slide-in');
                    // Добавляем задержку для каждого элемента, создавая эффект "поочередного" появления
                    item.style.animationDelay = `${index * 0.1}s`;
                });
            }, 50); // Небольшая задержка, чтобы браузер успел применить сброс стилей
        }
    }

    // Добавляем слушатели событий 'toggle' для каждой плашки
    residentsDetails.addEventListener('toggle', () => {
        animateDropdownContent(residentsDetails);
    });

    districtsDetails.addEventListener('toggle', () => {
        animateDropdownContent(districtsDetails);
    });
});
