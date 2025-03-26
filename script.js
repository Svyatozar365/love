// Ждем, пока вся страница загрузится
document.addEventListener('DOMContentLoaded', function() {

    // Находим элементы
    const button = document.getElementById('specialButton');
    const hiddenMessageDiv = document.getElementById('hiddenMessage');
    const confettiCanvas = document.getElementById('confetti-canvas');

    // Настраиваем функцию конфетти (если canvas найден)
    const fireConfetti = confettiCanvas ? confetti.create(confettiCanvas, {
        resize: true, // Автоматически изменять размер при изменении окна
        useWorker: true // Использовать Web Worker для лучшей производительности (если возможно)
    }) : null;

    // Флаг, чтобы избежать повторного срабатывания, если клик быстрый
    let isRevealing = false;

    // Добавляем обработчик события "клик" на кнопку
    button.addEventListener('click', function() {
        // Если уже в процессе или кнопка отключена, ничего не делаем
        if (isRevealing || button.disabled) {
            return;
        }
        isRevealing = true;

        // 1. Запускаем конфетти!
        if (fireConfetti) {
            fireConfetti({
                particleCount: 150, // Больше частиц!
                spread: 100,       // Шире разброс
                origin: { y: 0.6 }, // Старт чуть ниже центра
                colors: ['#ff4081', '#e91e63', '#f8bbd0', '#ffffff', '#fce4ec'] // Розовые и белые цвета
            });
        }

        // 2. Плавно показываем скрытое сообщение
        hiddenMessageDiv.classList.add('visible');

        // 3. Меняем текст кнопки и отключаем ее
        // Небольшая задержка перед изменением текста/отключением для лучшего эффекта
        setTimeout(() => {
            button.innerHTML = '<span class="button-icon">🥰</span> Сюрприз удался!'; // Меняем текст и иконку
            button.disabled = true;
            // Можно убрать стили hover/active после отключения, но :disabled уже справляется
        }, 300); // Задержка в 300 мс

        // 4. Плавно прокручиваем страницу к появившемуся сообщению
        // Даем анимации показа немного времени перед прокруткой
        setTimeout(() => {
            hiddenMessageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            isRevealing = false; // Завершили процесс
        }, 500); // Задержка чуть больше, чем у изменения кнопки

    });

    // Небольшой бонус: добавляем класс к body, когда все загружено,
    // чтобы избежать "прыжка" анимации контейнера, если JS сработает раньше CSS
    document.body.classList.add('loaded');

});

// Дополнительный стиль в CSS для .loaded, если нужен (сейчас не используется, но полезно знать)
/*
body:not(.loaded) .container {
    opacity: 0;
}
*/
