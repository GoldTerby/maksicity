document.addEventListener('DOMContentLoaded', function() {
    // Получаем необходимые элементы карусели
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let currentIndex = 0; // Текущий индекс активного слайда
    const maxVisibleDots = 10; // Максимальное количество отображаемых кружочков-индикаторов

    // Очень важная проверка: убедимся, что все элементы карусели найдены.
    // Если какого-то элемента нет, выведем ошибку в консоль и прервем выполнение скрипта карусели.
    if (!carouselTrack || !prevButton || !nextButton || !dotsContainer) {
        console.error("Ошибка: Не найдены все необходимые элементы карусели. Проверьте HTML структуру на предмет классов 'carousel-track', 'carousel-button.prev', 'carousel-button.next', 'carousel-dots'.");
        return; // Выходим из функции, чтобы избежать дальнейших ошибок
    }

    /**
     * Функция для создания и обновления кружочков-индикаторов.
     * Она динамически очищает и перерисовывает кружочки в зависимости от
     * общего количества слайдов и текущего индекса.
     * @param {number} currentTotalSlides - Актуальное общее количество слайдов.
     */
    function renderDots(currentTotalSlides) {
        dotsContainer.innerHTML = ''; // Очищаем контейнер от старых кружочков, чтобы избежать дублирования

        // Если слайдов нет, кружочки не нужны
        if (currentTotalSlides === 0) {
            return;
        }

        let startDotIndex = 0;
        // Если слайдов больше, чем максимальное количество видимых кружочков,
        // вычисляем начальный индекс для отображаемого блока кружочков.
        // Это создает эффект "страниц" для кружочков.
        if (currentTotalSlides > maxVisibleDots) {
            startDotIndex = Math.floor(currentIndex / maxVisibleDots) * maxVisibleDots;
        }

        // Создаем кружочки. Отображаем либо все кружочки (если их <= maxVisibleDots),
        // либо только maxVisibleDots, начиная с вычисленного startDotIndex.
        for (let i = 0; i < Math.min(currentTotalSlides, maxVisibleDots); i++) {
            const dotActualSlideIndex = startDotIndex + i; // Индекс слайда, которому соответствует кружочек

            // Если реальный индекс слайда превышает общее количество слайдов,
            // значит, больше кружочков для текущего "блока" не требуется.
            if (dotActualSlideIndex >= currentTotalSlides) {
                break;
            }

            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.slide = dotActualSlideIndex.toString(); // Сохраняем реальный индекс слайда в атрибуте data-slide
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
        // Важно: получаем кружочки снова, так как renderDots() их пересоздает
        const dots = Array.from(dotsContainer.querySelectorAll('.dot'));
        dots.forEach(dot => {
            // Проверяем, соответствует ли data-slide кружочка текущему активному слайду
            if (parseInt(dot.dataset.slide) === currentIndex) {
                dot.classList.add('active'); // Делаем текущий кружочек активным
            } else {
                dot.classList.remove('active'); // Деактивируем остальные кружочки
            }
        });
    }

    /**
     * Основная функция для обновления состояния карусели (позиции слайдов и кружочков).
     * Эта функция теперь вызывает `renderDots()` и `updateDotsState()` для актуализации.
     */
    function updateCarousel() {
        // --- КРИТИЧЕСКОЕ ИЗМЕНЕНИЕ: Получаем актуальное количество слайдов при каждом обновлении ---
        // Это позволяет карусели адаптироваться к динамически добавленным/удаленным слайдам.
        const slides = Array.from(document.querySelectorAll('.carousel-slide'));
        const currentTotalSlides = slides.length;

        // Если currentIndex выходит за пределы нового количества слайдов, корректируем его
        // Или если слайдов нет, сбрасываем индекс
        if (currentTotalSlides === 0) {
            currentIndex = 0;
        } else if (currentIndex >= currentTotalSlides) {
            currentIndex = currentTotalSlides - 1; // Переходим к последнему слайду, если вышли за границы
        } else if (currentIndex < 0) { // Если ушли в отрицательный индекс (например, при быстром переключении)
            currentIndex = 0; // Сбрасываем на первый слайд
        }


        // Вычисляем смещение для трека карусели, чтобы показать текущий слайд
        const offset = -currentIndex * 100;
        carouselTrack.style.transform = `translateX(${offset}%)`;

        // Перерисовываем и обновляем состояние кружочков, передавая актуальное количество слайдов
        renderDots(currentTotalSlides);
    }

    /**
     * Переход к следующему слайду.
     */
    function showNextSlide() {
        // Получаем актуальное количество слайдов перед расчетом следующего индекса
        const currentTotalSlides = Array.from(document.querySelectorAll('.carousel-slide')).length;
        if (currentTotalSlides === 0) return; // Если нет слайдов, ничего не делаем

        currentIndex = (currentIndex + 1) % currentTotalSlides; // Переключаемся на следующий слайд, зацикливая
        updateCarousel(); // Обновляем карусель
    }

    /**
     * Переход к предыдущему слайду.
     */
    function showPrevSlide() {
        // Получаем актуальное количество слайдов перед расчетом предыдущего индекса
        const currentTotalSlides = Array.from(document.querySelectorAll('.carousel-slide')).length;
        if (currentTotalSlides === 0) return; // Если нет слайдов, ничего не делаем

        // Добавляем currentTotalSlides перед операцией по модулю, чтобы избежать отрицательных результатов
        currentIndex = (currentIndex - 1 + currentTotalSlides) % currentTotalSlides;
        updateCarousel(); // Обновляем карусель
    }

    // Добавляем слушателей событий для кнопок навигации
    prevButton.addEventListener('click', showPrevSlide);
    nextButton.addEventListener('click', showNextSlide);

    // Добавляем слушателя событий для контейнера с кружочками (делегирование событий).
    // Это очень важно, так как кружочки динамически создаются и удаляются.
    dotsContainer.addEventListener('click', function(event) {
        // Проверяем, был ли клик по элементу с классом 'dot'
        if (event.target.classList.contains('dot')) {
            // Убеждаемся, что dot.dataset.slide содержит числовой индекс
            const clickedSlideIndex = parseInt(event.target.dataset.slide);
            if (!isNaN(clickedSlideIndex)) { // Проверяем, что это число
                currentIndex = clickedSlideIndex; // Устанавливаем текущий слайд на основе data-slide
                updateCarousel(); // Обновляем карусель
            } else {
                console.warn('Клик по кружочку: data-slide не является числом.', event.target.dataset.slide);
            }
        }
    });

    // Инициализация карусели при загрузке страницы
    updateCarousel();

    // --- КОД ДЛЯ АНИМАЦИИ РАСКРЫВАЮЩИХСЯ ПЛАШЕК (без изменений) ---
    // Этот блок кода не связан с каруселью и остается как есть.
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

        // Выбираем все анимируемые элементы внутри контейнера.
        const items = contentContainer.querySelectorAll('.animated-item');

        // Сначала удаляем класс анимации и сбрасываем задержку для всех элементов,
        // чтобы анимация могла быть запущена снова при повторном открытии.
        items.forEach(item => {
            item.classList.remove('slide-in');
            item.style.animationDelay = ''; // Сброс индивидуальной задержки
        });

        if (detailsElement.open) {
            // Если плашка открывается
            setTimeout(() => {
                items.forEach((item, index) => {
                    item.classList.add('slide-in');
                    item.style.animationDelay = `${index * 0.1}s`; // Задержка 0.1 секунды на каждый элемент
                });
            }, 50); // Небольшая задержка, чтобы браузер успел применить сброс стилей
        }
    }

    // Добавляем слушатели событий 'toggle' для каждой плашки,
    // предварительно проверив, что эти элементы существуют.
    if (residentsDetails) {
        residentsDetails.addEventListener('toggle', () => {
            animateDropdownContent(residentsDetails);
        });
    }
    if (districtsDetails) {
        districtsDetails.addEventListener('toggle', () => {
            animateDropdownContent(districtsDetails);
        });
    }
});
