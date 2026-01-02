document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Load Header
    fetch("components/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;
            
            // --- TRIGGER TYPING EFFECT AFTER HEADER LOADS ---
            startTypingEffect(); 
        });

    // 2. Load Footer
    fetch("components/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });
});

// --- THE TYPING EFFECT FUNCTION ---
function startTypingEffect() {
    const input = document.getElementById("search");
    // Safety check: if input doesn't exist, stop
    if (!input) return; 

    const words = [
        "What is The 27LINKS?",
        "Study material for 12th class",
        "Termux Commands...",
        "Coding tutorials...",
        "Robotics guides..."
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];
        const displayedText = currentWord.substring(0, charIndex);

        input.setAttribute("placeholder", displayedText);

        if (!deleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(typeEffect, 50);
        } 
        else if (deleting && charIndex > 0) {
            charIndex--;
            setTimeout(typeEffect, 50);
        } 
        else if (!deleting && charIndex === currentWord.length) {
            deleting = true;
            setTimeout(typeEffect, 1000);
        } 
        else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(typeEffect, 400);
        }
    }
    
    // Start the loop
    typeEffect();
}
