// =========================================
// 1. THE DATABASE (Your Website Content)
// =========================================
const searchIndex = [
    { title: "Home", url: "index.html", type: "Page", status: "Live" },
    { title: "Termux Commands", url: "termux.html", type: "Guide", status: "Available" },
    { title: "Python Projects", url: "python.html", type: "Code", status: "Available" },
    { title: "12th Class Study Material", url: "study.html", type: "PDF", status: "Download" },
    { title: "Robotics Guides", url: "robotics.html", type: "Guide", status: "Coming Soon" },
    { title: "About The 27LINKS", url: "about.html", type: "Profile", status: "Live" },
    { title: "Contact Robert Storm", url: "contact.html", type: "Page", status: "Live" }
];

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Load Header
    fetch("components/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;
            
            // --- START FEATURES AFTER HEADER LOADS ---
            startTypingEffect(); 
            initSearchEngine(); // <--- NEW SEARCH FEATURE LAUNCHED HERE
        });

    // 2. Load Footer
    fetch("components/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });
});

// =========================================
// 2. TYPING EFFECT FUNCTION (Existing)
// =========================================
function startTypingEffect() {
    const input = document.getElementById("search");
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
    typeEffect();
}

// =========================================
// 3. SEARCH ENGINE LOGIC (New)
// =========================================
function initSearchEngine() {
    const searchInput = document.getElementById("search");
    const searchContainer = document.querySelector(".search-container");

    // Safety check in case HTML changed
    if (!searchInput || !searchContainer) return;

    // Create the Dropdown Results Box
    const resultsBox = document.createElement('div');
    resultsBox.className = 'storm-search-results';
    
    // Ensure the container allows absolute positioning of the dropdown
    searchContainer.style.position = 'relative'; 
    searchContainer.appendChild(resultsBox);

    // Listen for typing
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        resultsBox.innerHTML = ''; // Clear old results

        if (query.length > 0) {
            const matches = searchIndex.filter(item => 
                item.title.toLowerCase().includes(query)
            );

            if (matches.length > 0) {
                resultsBox.style.display = 'block';
                
                matches.forEach(match => {
                    const item = document.createElement('a');
                    item.href = match.url;
                    item.className = 'storm-result-item';
                    
                    item.innerHTML = `
                        <div class="result-info">
                            <span class="result-title">${match.title}</span>
                            <span class="result-type">[${match.type}]</span>
                        </div>
                        <span class="result-status ${match.status.toLowerCase().replace(' ', '-')}">${match.status}</span>
                    `;
                    resultsBox.appendChild(item);
                });
            } else {
                resultsBox.style.display = 'block';
                resultsBox.innerHTML = `<div class="no-result">Checking Database... No Entry Found.</div>`;
            }
        } else {
            resultsBox.style.display = 'none';
        }
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            resultsBox.style.display = 'none';
        }
    });
}
