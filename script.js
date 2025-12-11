document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Terminal typing effect for hero description
    const terminalText = document.querySelector('.terminal-text');
    if (terminalText) {
        const textToType = terminalText.innerText;
        terminalText.innerText = '';
        let i = 0;

        function typeWriter() {
            if (i < textToType.length) {
                terminalText.innerText += textToType.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Add blinking cursor at the end
                terminalText.style.borderRight = '2px solid var(--accent-green)';
            }
        }

        setTimeout(typeWriter, 500); // Start after slight delay
    }
});
