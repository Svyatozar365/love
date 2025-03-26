document.addEventListener('DOMContentLoaded', function() {

    // --- Элементы DOM ---
    const button = document.getElementById('specialButton');
    const hiddenMessageDiv = document.getElementById('hiddenMessage');
    const reasonsPrompt = document.getElementById('reasons-prompt');
    const reasonsSection = document.getElementById('reasons-section');
    const reasonsList = document.getElementById('reasons-list');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const body = document.body;
    const backgroundHearts = document.querySelector('.background-hearts');

    // --- Состояние ---
    let isRevealing = false;
    // Проверяем, похоже ли устройство на мобильное (по ширине экрана)
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // --- Настройка Конфетти ---
    const fireConfetti = confettiCanvas ? confetti.create(confettiCanvas, {
        resize: true,
        useWorker: true // Используем Worker для производительности
    }) : null;

    // --- Функции ---

    // Функция запуска конфетти
    function triggerConfetti() {
        if (!fireConfetti) return; // Выходим, если конфетти не настроено

        // Настройки конфетти (немного разные для мобильных и десктопа)
        const confettiOptions = {
             particleCount: isMobile ? 120 : 180, // Меньше частиц на мобильных
             spread: isMobile ? 90 : 120,        // Меньший разброс на мобильных
             origin: { y: 0.5 }, // Начинаются примерно из центра по вертикали
             colors: ['#e91e63', '#ff80ab', '#fce4ec', '#ffffff', '#ffcc80'], // Цвета
             scalar: isMobile ? 0.9 : 1.1 // Размер частиц
        };

        fireConfetti(confettiOptions); // Запускаем!
    }

    // Функция показа секции "Причины" и анимации списка
    function revealReasons() {
        // Показываем контейнер секции
        reasonsSection.classList.add('visible');

        // Анимируем пункты списка с задержкой
        const listItems = reasonsList.querySelectorAll('li');
        listItems.forEach((item, index) => {
            // Устанавливаем задержку анимации для каждого пункта
            item.style.transitionDelay = `${index * 0.15}s`;
            // Применяем стили для "появления" (прозрачность и сдвиг)
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        });

         // Плавно прокручиваем к началу секции после небольшой задержки
         setTimeout(() => {
             reasonsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }, 200); // Задержка, чтобы анимация успела начаться
    }

    // --- Обработчики Событий ---

    // Клик по главной кнопке
    button.addEventListener('click', function() {
        // Предотвращаем повторное срабатывание во время анимации или если кнопка отключена
        if (isRevealing || button.disabled) return;
        isRevealing = true; // Флаг, что процесс начался

        // Вибрация на мобильных устройствах (если поддерживается)
        if (isMobile && navigator.vibrate) {
            navigator.vibrate(100); // Вибрируем 100 миллисекунд
        }

        // 1. Запускаем конфетти
        triggerConfetti();

        // 2. Показываем первое скрытое сообщение
        hiddenMessageDiv.classList.add('visible');

        // 3. Обновляем текст кнопки и отключаем её (с небольшой задержкой)
        setTimeout(() => {
            button.innerHTML = '<span class="button-icon">💖</span> День Рождения!'; // Новый текст и иконка
            button.disabled = true; // Отключаем кнопку
        }, 300);

        // 4. Плавно прокручиваем к первому сообщению
        hiddenMessageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 5. Показываем подсказку внутри первого сообщения
        reasonsPrompt.style.opacity = '1';

        // 6. Показываем секцию "Причины" после задержки
        setTimeout(() => {
            revealReasons();
            isRevealing = false; // Сбрасываем флаг после завершения
        }, 1800); // Задержка после появления первого сообщения (можно настроить)
    });


    // --- Логика взаимодействия в зависимости от устройства ---

    if (isMobile) {
        // --- Параллакс от наклона устройства (только для мобильных) ---
        // Проверяем поддержку DeviceOrientationEvent и наличие элемента фона
        if (window.DeviceOrientationEvent && backgroundHearts) {
            window.addEventListener('deviceorientation', (event) => {
                // Получаем углы наклона (beta: вперед-назад, gamma: влево-вправо)
                // Ограничиваем значения углов для более плавной реакции
                const tiltLR = Math.max(-45, Math.min(45, event.gamma || 0)); // Наклон влево-вправо
                const tiltFB = Math.max(-45, Math.min(45, event.beta || 0));  // Наклон вперед-назад

                // Коэффициент силы параллакса (можно настроить)
                const parallaxFactor = 0.15;

                // Рассчитываем смещение (инвертируем знак для эффекта параллакса)
                const offsetX = -(tiltLR * parallaxFactor);
                const offsetY = -(tiltFB * parallaxFactor);

                // Применяем трансформацию к фону через requestAnimationFrame для плавности
                 requestAnimationFrame(() => {
                     if (backgroundHearts) { // Доп. проверка на случай, если элемент пропадет
                        backgroundHearts.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                     }
                 });
            });
        }
    } else {
        // --- Эффект следа мыши (только для десктопа) ---
        body.addEventListener('mousemove', (e) => {
            // Создаем элемент следа
            const trail = document.createElement('div');
            trail.className = 'trail';
            body.appendChild(trail);

            // Позиционируем его у курсора (с небольшим смещением для центровки)
            trail.style.left = (e.pageX - 4) + 'px';
            trail.style.top = (e.pageY - 4) + 'px';

            // Удаляем элемент после завершения анимации исчезновения
            setTimeout(() => {
                // Проверяем, существует ли элемент еще в DOM перед удалением
                if (trail.parentNode === body) {
                   body.removeChild(trail);
                }
            }, 700); // Время должно совпадать с длительностью анимации fadeOutTrail в CSS
        });
    }

    // --- Инициализация ---
    // Добавляем класс к body, чтобы показать контент после загрузки JS
    // Это предотвращает "мигание" нестилизованного контента
    body.classList.add('loaded');

});
