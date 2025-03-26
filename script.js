document.addEventListener('DOMContentLoaded', function() {

    // --- Elements ---
    const button = document.getElementById('specialButton');
    const hiddenMessageDiv = document.getElementById('hiddenMessage');
    const reasonsPrompt = document.getElementById('reasons-prompt');
    const reasonsSection = document.getElementById('reasons-section');
    const reasonsList = document.getElementById('reasons-list');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const body = document.body;

    // --- State ---
    let isRevealing = false;
    let trailElements = []; // To keep track of trail elements for potential cleanup

    // --- Confetti Setup ---
    const fireConfetti = confettiCanvas ? confetti.create(confettiCanvas, {
        resize: true,
        useWorker: true
    }) : null;

    // --- Functions ---

    // Function to trigger confetti burst
    function triggerConfetti() {
        if (!fireConfetti) return;
        fireConfetti({
            particleCount: 180, // More!
            spread: 120,        // Wider spread
            origin: { y: 0.5 }, // Centered vertically
            colors: ['#e91e63', '#ff80ab', '#fce4ec', '#ffffff', '#ffcc80'], // Added gold sparkle color
            scalar: 1.1 // Slightly larger particles
        });
    }

    // Function to reveal the "Reasons I Love You" section and animate list
    function revealReasons() {
        reasonsSection.classList.add('visible');

        // Staggered animation for list items
        const listItems = reasonsList.querySelectorAll('li');
        listItems.forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.15}s`; // Stagger delay
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        });

         // Scroll smoothly to the top of the reasons section after it starts animating
         setTimeout(() => {
             reasonsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
         }, 200); // Small delay to let the transition start
    }

    // --- Event Listeners ---

    // Button Click Handler
    button.addEventListener('click', function() {
        if (isRevealing || button.disabled) return;
        isRevealing = true;

        // 1. Trigger Confetti
        triggerConfetti();

        // 2. Show Initial Hidden Message
        hiddenMessageDiv.classList.add('visible');

        // 3. Update Button State (with delay)
        setTimeout(() => {
            button.innerHTML = '<span class="button-icon">💖</span> День Рождения!';
            button.disabled = true;
        }, 300);

        // 4. Scroll to Initial Hidden Message
        hiddenMessageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // 5. Reveal the prompt inside the hidden message
         reasonsPrompt.style.opacity = '1';


        // 6. After a delay, reveal the "Reasons" section
        setTimeout(() => {
            revealReasons();
            isRevealing = false; // Reset flag after full sequence
        }, 1800); // Delay after initial message appears (adjust timing as needed)

    });


    // --- NEW: Mouse Trail Effect ---
    body.addEventListener('mousemove', (e) => {
        // Limit creation rate for performance (optional)
        // if (Math.random() < 0.8) return;

        const trail = document.createElement('div');
        trail.className = 'trail';
        body.appendChild(trail);
        trailElements.push(trail); // Add to array

        // Position the trail element slightly offset from cursor
        trail.style.left = (e.pageX - 4) + 'px'; // Adjust offset as needed
        trail.style.top = (e.pageY - 4) + 'px';

        // Clean up the element after animation
        setTimeout(() => {
            body.removeChild(trail);
            // Remove from array (optional, good practice)
            trailElements = trailElements.filter(el => el !== trail);
        }, 700); // Must match animation duration in CSS
    });

    // --- Initial Load Class ---
    body.classList.add('loaded');

});
