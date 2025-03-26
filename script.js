document.addEventListener('DOMContentLoaded', function() {

    // === Initial Setup ===
    const button = document.getElementById('specialButton');
    const hiddenMessageDiv = document.getElementById('hiddenMessage');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const body = document.body;

    // Confetti setup
    const fireConfetti = confettiCanvas ? confetti.create(confettiCanvas, {
        resize: true, useWorker: true
    }) : null;

    let isRevealing = false;

    // Remove preload class after a short delay to allow initial rendering
    setTimeout(() => {
        body.classList.remove('preload');
    }, 100); // Short delay

    // === Main Button Click Logic ===
    button.addEventListener('click', function() {
        if (isRevealing || button.disabled) return;
        isRevealing = true;

        // 1. Confetti!
        if (fireConfetti) {
            fireConfetti({
                particleCount: 180, spread: 120, origin: { y: 0.6 },
                colors: ['#ff4081', '#e91e63', '#f8bbd0', '#ffffff', '#fce4ec', '#ffeb3b'] // Added gold
            });
        }

        // 2. Show Hidden Message
        hiddenMessageDiv.classList.add('visible');

        // 3. Update Button State
        setTimeout(() => {
            button.innerHTML = '<span class="button-icon">🥰</span> Навсегда твой!';
            button.disabled = true;
        }, 300);

        // 4. Scroll to Message & Setup Constellation
        setTimeout(() => {
            hiddenMessageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to start of message
            setupConstellation(); // Initialize the stars after message is visible
            isRevealing = false;
        }, 600); // Longer delay to allow reveal animation
    });

    // === NEW: Constellation Logic ===
    const constellationSection = document.getElementById('constellationSection');
    const starsContainer = constellationSection.querySelector('.stars-container');
    const starMessageDisplay = document.getElementById('starMessageDisplay');
    const starMessageP = starMessageDisplay.querySelector('p');

    // Define your star messages here - make them personal and heartfelt!
    const starMessages = [
        "Твоя улыбка освещает мой мир ярче любого солнца! ✨",
        "Люблю твою доброту и нежность ко всему живому. 💖",
        "Помню нашу первую встречу... это было волшебно! 😊",
        "Ты делаешь меня лучше каждый день. Спасибо! 🙏",
        "Мечтаю провести с тобой всю вечность. 💍",
        "Твои объятия - моё самое безопасное место. 🤗",
        "Ценю твою мудрость и поддержку во всём. 🌟",
        "Люблю наши уютные вечера и разговоры обо всём. ☕️",
        // Добавь столько, сколько хочешь!
    ];

    let stars = []; // To hold star elements

    function setupConstellation() {
        if (!starsContainer) return; // Safety check

        // Clear any previous stars (if function is called again)
        starsContainer.innerHTML = '';
        stars = []; // Reset array

        // Create stars
        starMessages.forEach((msg, index) => {
            const star = document.createElement('span');
            star.classList.add('star');
            star.textContent = '★'; // Star character
            star.dataset.message = msg; // Store message in data attribute
            star.dataset.index = index; // Store index

            // Add random slight offset for more natural placement (optional)
            const offsetX = Math.random() * 10 - 5; // -5px to +5px
            const offsetY = Math.random() * 10 - 5;
            star.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

            star.addEventListener('click', handleStarClick);

            starsContainer.appendChild(star);
            stars.push(star);
        });

         // Initial message display styling
        starMessageP.textContent = "Коснись звёздочки...";
        starMessageP.classList.add('visible'); // Show initial prompt
    }

    function handleStarClick(event) {
        const clickedStar = event.target;

        // Ignore if already ignited
        if (clickedStar.classList.contains('ignited')) return;

        // "Ignite" the star
        clickedStar.classList.add('ignited');

        // Display the message
        const message = clickedStar.dataset.message;
        displayStarMessage(message);

        // Optional: Make other stars slightly dimmer momentarily? (Advanced effect)
        stars.forEach(star => {
            if (star !== clickedStar && !star.classList.contains('ignited')) {
                // star.style.opacity = '0.6';
                // setTimeout(() => { star.style.opacity = ''; }, 500);
            }
        });

         // Play a subtle sound? (Requires <audio> element)
    }

    let messageTimeout; // To handle sequential message display fade-outs
    function displayStarMessage(message) {
        // Clear previous timeout if exists
        if (messageTimeout) clearTimeout(messageTimeout);

        // Fade out current message quickly
        starMessageP.classList.remove('visible');

         // Use a short timeout to allow fade-out before changing text and fading in
         messageTimeout = setTimeout(() => {
            starMessageP.textContent = message;
            starMessageP.classList.add('visible'); // Fade in new message
         }, 250); // Wait for fade-out transition (half of 0.5s)
    }

});
