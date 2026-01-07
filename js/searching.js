// 1. THE DATABASE
        const searchIndex = [
            { 
                title: "Home", 
                url: "#", 
                type: "Page", 
                status: "Live",
                keywords: ["main", "start", "landing", "welcome", "storm"]
            },
            { 
                title: "Termux Commands", 
                url: "#", 
                type: "Guide", 
                status: "Available",
                keywords: ["hacking", "terminal", "android", "linux", "shell", "tools", "ethical"]
            },
            { 
                title: "Python Projects", 
                url: "#", 
                type: "Code", 
                status: "Available",
                keywords: ["programming", "coding", "software", "development", "scripts", "automation"]
            },
            { 
                title: "12th Class Study Material", 
                url: "#", 
                type: "PDF", 
                status: "Download",
                keywords: ["books", "notes", "exam", "board", "physics", "chemistry", "maths", "syllabus"]
            },
            { 
                title: "Robotics Guides", 
                url: "#", 
                type: "Guide", 
                status: "Coming Soon",
                keywords: ["arduino", "electronics", "circuit", "motors", "hardware", "iot", "sensors"]
            }
        ];

        // 2. THE SEARCH LOGIC
        function initSearchEngine() {
            const searchInput = document.getElementById("search");
            const searchContainer = document.querySelector(".search-container");

            // Create Results Box Dynamically
            let resultsBox = document.createElement('div');
            resultsBox.className = 'storm-search-results';
            searchContainer.appendChild(resultsBox);

            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                resultsBox.innerHTML = ''; 

                if (query.length === 0) {
                    resultsBox.style.display = 'none';
                    return;
                }

                const queryWords = query.split(/\s+/); 

                // Scoring Algorithm
                const scoredResults = searchIndex.map(item => {
                    let score = 0;
                    const titleLower = item.title.toLowerCase();

                    queryWords.forEach(word => {
                        if (word.length < 2) return; 

                        // 10 Points for Title
                        if (titleLower.includes(word)) score += 10;
                        
                        // 5 Points for Keywords
                        if (item.keywords.some(k => k.toLowerCase().includes(word))) score += 5;
                    });

                    return { item, score };
                });

                // Filter & Sort
                const finalResults = scoredResults
                    .filter(result => result.score > 0)
                    .sort((a, b) => b.score - a.score);

                // Render
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
                            <span class="result-status">${item.status}</span>
                        `;
                        resultsBox.appendChild(link);
                    });
                } else {
                    resultsBox.style.display = 'block';
                    resultsBox.innerHTML = `<div class="no-result">No matches found.</div>`;
                }
            });

            // Close when clicking outside
            document.addEventListener('click', function(e) {
                if (!searchContainer.contains(e.target)) {
                    resultsBox.style.display = 'none';
                }
            });
        }

        // Initialize immediately for this demo
        initSearchEngine();
