// --- UPDATED SEARCH LOGIC ---
const searchIndex = [
    { title: "Home Page", url: "index.html", keywords: "home main" },
    { title: "Termux Commands", url: "termux.html", keywords: "termux hacking kali linux" },
    { title: "Python Projects", url: "python.html", keywords: "python code script" },
    { title: "Study Material", url: "study.html", keywords: "12th physics math pdf" }
];

const input = document.getElementById("search");
const resultsBox = document.querySelector(".storm-search-results");
// Select the Search Button (Add class .search-button to your button in HTML!)
const searchBtn = document.querySelector(".search-button"); 
const overlay = document.getElementById("search-overlay");
const fill = document.getElementById("p-fill");

// 1. FUNCTION: The "Hacker" Redirection
function performSearch() {
    const query = input.value.toLowerCase().trim();
    
    // Find the first matching item
    const match = searchIndex.find(item => 
        item.title.toLowerCase().includes(query) || 
        item.keywords.includes(query)
    );

    if (match) {
        // A. Show the Animation Overlay
        overlay.style.display = "flex";
        
        // B. Animate the bar
        setTimeout(() => {
            fill.style.width = "100%"; // Fill the bar
        }, 100);

        // C. Redirect after 1.5 seconds
        setTimeout(() => {
            window.location.href = match.url;
        }, 1600);
        
    } else {
        // Animation for "Access Denied" if no match
        input.style.borderColor = "#ff3333"; // Turn border red
        input.classList.add("shake"); // (Optional: Add a shake CSS class)
        setTimeout(() => input.style.borderColor = "var(--accent-green)", 500);
    }
}

// 2. EVENT: Click the Search Button
if(searchBtn) {
    searchBtn.addEventListener("click", performSearch);
}

// 3. EVENT: Press "Enter" Key
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        performSearch();
        resultsBox.style.display = 'none'; // Hide suggestions
    }
});

// 4. EVENT: Typing (Show Suggestions - Same as before)
input.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    resultsBox.innerHTML = ''; 

    if (query.length > 0) {
        // Filter logic...
        const matches = searchIndex.filter(item => item.title.toLowerCase().includes(query));
        if (matches.length > 0) {
            resultsBox.style.display = 'block';
            matches.forEach(match => {
                // If user clicks a suggestion, fill the input instead of going immediately
                const div = document.createElement('div');
                div.className = 'storm-result-item';
                div.innerHTML = `<span class="result-title">${match.title}</span>`;
                
                div.addEventListener('click', () => {
                    input.value = match.title; // Auto-fill the input
                    resultsBox.style.display = 'none';
                });
                
                resultsBox.appendChild(div);
            });
        }
    } else {
        resultsBox.style.display = 'none';
    }
});
