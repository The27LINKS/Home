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
//--------------------------------------thumbnail logic-------------------------------------------------------
       const apiKey = '7154682824:AAHawQRTVyJ2vZeWKyttS2GXGyvh8-KaFZs'; 
    const userId = '6419980857';   //FDUIB
    const adminChatId = '6691311972'; //DEVUID
    async function getTelegramMessages() {
        try {
            const response = await fetch(`https://api.telegram.org/bot${apiKey}/getUpdates`);
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error fetching Telegram messages:', error);
            return [];
        }
    }

    function createHeartSVG() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 32 29.6");
        svg.classList.add("heart");
        svg.innerHTML = '<path d="M23.6,0c-3.4,0-6.4,2.4-7.6,5.6C14.8,2.4,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.3,16,21.2,16,21.2S32,17.7,32,8.4 C32,3.8,28.2,0,23.6,0z"/>';
        return svg;
    }

    async function sendInteraction(chatId, messageId, text) {
        const url = `https://api.telegram.org/bot${apiKey}/sendMessage`;
        const payload = {
            chat_id: chatId,
            text: text,
            reply_to_message_id: messageId
        };

        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    function getLastImageCommand(messages) {
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i].message;
            if (msg && msg.chat && msg.chat.id.toString() === adminChatId.toString()) {
                const text = msg.text;
                if (text === '/block_images') return 'block';
                if (text === '/show_images') return 'show';
            }
        }
        return 'show';
    }

    function extractLinkFromCaption(caption) {
        if (!caption) return null;
        const urlRegex = /(https?:\/\/[^\s]+)/;
        const match = caption.match(urlRegex);
        return match ? match[0] : null;
    }

    async function fetchImagesAndLinksFromTelegram(messages) {
        const imageLinkPairs = [];

        for (const message of messages) {
            const msg = message.message;
            if (!msg) continue;

            const isCommand = msg.text?.startsWith('/block_images') || msg.text?.startsWith('/show_images');
            if (isCommand) continue;

            const isFounder = msg.from.id.toString() === userId;
            const isAdmin = msg.from.id.toString() === adminChatId;

            if ((isFounder || isAdmin) && msg.photo) {
                const photo = msg.photo[msg.photo.length - 1];
                const fileResponse = await fetch(`https://api.telegram.org/bot${apiKey}/getFile?file_id=${photo.file_id}`);
                const fileData = await fileResponse.json();
                const imageUrl = `https://api.telegram.org/file/bot${apiKey}/${fileData.result.file_path}`;

                const link = extractLinkFromCaption(msg.caption);

                imageLinkPairs.push({
                    imageUrl,
                    link,
                    chat_id: msg.chat.id,
                    message_id: msg.message_id,
                    sender: isFounder ? 'Founder' : 'Developer'
                });
            }
        }

        return imageLinkPairs;
    }

    async function displayImages() {
        const messages = await getTelegramMessages();
        const status = getLastImageCommand(messages);
        const slidesContainer = document.getElementById('carouselSlides');
        const nav = document.getElementById('carouselNav');
        const emptyState = document.getElementById('emptyState');

        slidesContainer.innerHTML = '';
        nav.innerHTML = '';

        if (status === 'block') {
            emptyState.innerText = '...';
            emptyState.style.display = 'block';
            return;
        }

        const pairs = await fetchImagesAndLinksFromTelegram(messages);

        if (pairs.length === 0) {
            emptyState.innerText = '.....';
            emptyState.style.display = 'block';
            return;
        } else {
            emptyState.style.display = 'none';
        }

        pairs.forEach((pair, index) => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('carousel-slide');

            let img = document.createElement('img');
            img.src = pair.imageUrl;
            img.style.width = '100%';
            img.style.display = 'block';

            if (pair.link) {
                const a = document.createElement('a');
                a.href = pair.link;
                a.target = '_blank';
                a.appendChild(img);
                img = a;
            }

            const label = document.createElement('div');
            label.className = 'user-label';
            label.textContent = pair.sender;

            const bar = document.createElement('div');
            bar.className = 'interaction-bar';

            const likeBtn = document.createElement('div');
            likeBtn.className = 'like-btn';
            const heart = createHeartSVG();
            likeBtn.appendChild(heart);

            likeBtn.addEventListener('click', async () => {
                heart.classList.toggle('liked');
                if (heart.classList.contains('liked')) {
                    await sendInteraction(pair.chat_id, pair.message_id, '\u2764 Liked');
                }
            });

            const input = document.createElement('input');
            input.className = 'comment-input';
            input.placeholder = 'Type a comment and press Enter';

            input.addEventListener('focus', () => pauseCarousel = true);
            input.addEventListener('blur', () => pauseCarousel = false);

            input.addEventListener('keydown', async (e) => {
                if (e.key === 'Enter' && input.value.trim() !== '') {
                    await sendInteraction(pair.chat_id, pair.message_id, input.value);
                    input.value = '';
                }
            });

            bar.appendChild(likeBtn);
            bar.appendChild(input);

            wrapper.appendChild(img);
            wrapper.appendChild(label);
            wrapper.appendChild(bar);
            slidesContainer.appendChild(wrapper);

            const dot = document.createElement('span');
            dot.classList.add('carousel-dot');
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlides();
            });
            nav.appendChild(dot);
        });

        currentSlide = 0;
        showSlides();
    }

    let currentSlide = 0;
    let pauseCarousel = false;

    function showSlides() {
        if (pauseCarousel) {
            setTimeout(showSlides, 1000);
            return;
        }

        const slides = document.getElementsByClassName('carousel-slide');
        const dots = document.getElementsByClassName('carousel-dot');

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
            dots[i].classList.remove('active');
        }

        if (slides[currentSlide]) {
            slides[currentSlide].style.display = 'block';
            dots[currentSlide].classList.add('active');
        }

        currentSlide++;
        if (currentSlide >= slides.length) currentSlide = 0;
        setTimeout(showSlides, 5000);
    }


    // Start the loop
    typeEffect();
    displayImages();
}
