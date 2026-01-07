// =========================================
// 1. THE DATABASE (Expanded with Keywords)
// =========================================
const searchIndex = [
    { 
        title: "Home", 
        url: "index.html", 
        type: "Page", 
        status: "Live",
        keywords: ["main", "start", "landing", "welcome", "storm"]
    },
    { 
        title: "Termux Commands", 
        url: "termux.html", 
        type: "Guide", 
        status: "Available",
        keywords: ["hacking", "terminal", "android", "linux", "shell", "tools", "ethical"]
    },
    { 
        title: "Python Projects", 
        url: "python.html", 
        type: "Code", 
        status: "Available",
        keywords: ["programming", "coding", "software", "development", "scripts", "automation"]
    },
    { 
        title: "12th Class Study Material", 
        url: "study.html", 
        type: "PDF", 
        status: "Download",
        keywords: ["books", "notes", "exam", "board", "physics", "chemistry", "maths", "syllabus"]
    },
    { 
        title: "Robotics Guides", 
        url: "robotics.html", 
        type: "Guide", 
        status: "Coming Soon",
        keywords: ["arduino", "electronics", "circuit", "motors", "hardware", "iot", "sensors"]
    },
    { 
        title: "About The 27LINKS", 
        url: "about.html", 
        type: "Profile", 
        status: "Live",
        keywords: ["company", "founder", "info", "history", "mission", "vision"]
    },
    { 
        title: "Contact Robert Storm", 
        url: "contact.html", 
        type: "Page", 
        status: "Live",
        keywords: ["email", "phone", "support", "help", "reach", "message"]
    }
];

// ... (Keep your existing DOMContentLoaded and startTypingEffect code here) ...

// =========================================
// 3. SMART SEARCH ENGINE LOGIC (Updated)
// =========================================
function initSearchEngine() {
    const searchInput = document.getElementById("search");
    const searchContainer = document.querySelector(".search-container");

    if (!searchInput || !searchContainer) return;

    // Create Results Box
    let resultsBox = document.querySelector('.storm-search-results');
    if (!resultsBox) {
        resultsBox = document.createElement('div');
        resultsBox.className = 'storm-search-results';
        searchContainer.style.position = 'relative'; 
        searchContainer.appendChild(resultsBox);
    }

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        resultsBox.innerHTML = ''; 

        if (query.length === 0) {
            resultsBox.style.display = 'none';
            return;
        }

        // --- STEP A: TOKENIZE INPUT ---
        // Split sentence into words: "python for hacking" -> ["python", "for", "hacking"]
        const queryWords = query.split(/\s+/); 

        // --- STEP B: SCORING ALGORITHM ---
        const scoredResults = searchIndex.map(item => {
            let score = 0;
            const titleLower = item.title.toLowerCase();

            // Check each word the user typed
            queryWords.forEach(word => {
                if (word.length < 2) return; // Skip single letters

                // 10 Points for Title Match
                if (titleLower.includes(word)) {
                    score += 10;
                }
                
                // 5 Points for Keyword Match
                if (item.keywords.some(k => k.toLowerCase().includes(word))) {
                    score += 5;
                }
            });

            return { item, score };
        });

        // --- STEP C: FILTER & SORT ---
        // 1. Remove items with 0 score (no match)
        // 2. Sort by highest score first
        const finalResults = scoredResults
            .filter(result => result.score > 0)
            .sort((a, b) => b.score - a.score);

        // --- STEP D: RENDER ---
        if (finalResults.length > 0) {
            resultsBox.style.display = 'block';
            
            finalResults.forEach(({ item }) => {
                const link = document.createElement('a');
                link.href = item.url;
                link.className = 'storm-result-item';
                
                link.innerHTML = `
                    <div class="result-info">
                        <span class="result-title">${item.title}</span>
                        <span class="result-type">[${item.type}]</span>
                    </div>
                    <span class="result-status ${item.status.toLowerCase().replace(/\s+/g, '-')}">${item.status}</span>
                `;
                resultsBox.appendChild(link);
            });
        } else {
            resultsBox.style.display = 'block';
            resultsBox.innerHTML = `<div class="no-result">No matches found in database.</div>`;
        }
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            resultsBox.style.display = 'none';
        }
    });
}
