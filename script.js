// Ждем, пока вся страница загрузится
document.addEventListener('DOMContentLoaded', function() {

    // Находим кнопку и скрытое сообщение по их ID
    const button = document.getElementById('specialButton');
    const hiddenMessageDiv = document.getElementById('hiddenMessage');

    // Добавляем обработчик события "клик" на кнопку
    button.addEventListener('click', function() {
        // Показываем скрытое сообщение, добавляя класс 'visible'
        hiddenMessageDiv.classList.add('visible');

        // Плавно прокручиваем страницу к появившемуся сообщению (необязательно, но приятно)
        hiddenMessageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Можно изменить текст кнопки после нажатия
        button.textContent = 'Сюрприз! Надеюсь, тебе нравится 🥰';

        // Можно сделать кнопку неактивной после одного нажатия
        button.disabled = true;
        button.style.cursor = 'default'; // Убираем указатель
        button.style.opacity = '0.7'; // Делаем ее полупрозрачной
    });

});