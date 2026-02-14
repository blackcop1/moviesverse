// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'user') {
    window.location.href = 'index.html';
}

// Display user info
document.getElementById('userName').textContent = currentUser.name;
document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();

// Load movies and series
function loadContent() {
    const movies = JSON.parse(localStorage.getItem('movies'));
    const moviesGrid = document.getElementById('moviesGrid');
    const seriesGrid = document.getElementById('seriesGrid');
    
    moviesGrid.innerHTML = '';
    seriesGrid.innerHTML = '';
    
    movies.forEach(item => {
        const card = createContentCard(item);
        if (item.type === 'movie') {
            moviesGrid.appendChild(card);
        } else {
            seriesGrid.appendChild(card);
        }
    });
    
    // Set featured content
    if (movies.length > 0) {
        const featured = movies[0];
        document.getElementById('heroTitle').textContent = featured.title;
        document.getElementById('heroDescription').textContent = featured.description;
    }
}

function createContentCard(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.onclick = () => playContent(item);
    
    card.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}">
        <div class="content-info">
            <h3>${item.title}</h3>
            <div class="content-meta">
                <span>${item.year}</span>
                <span class="rating">★ ${item.rating}</span>
            </div>
        </div>
    `;
    
    return card;
}

function playContent(item) {
    logActivity(currentUser.id, `Watched: ${item.title}`);
    
    document.getElementById('videoFrame').src = item.videoUrl;
    document.getElementById('videoTitle').textContent = item.title;
    document.getElementById('videoDescription').textContent = item.description;
    document.getElementById('videoPlayer').classList.add('active');
}

function playFeatured() {
    const movies = JSON.parse(localStorage.getItem('movies'));
    if (movies.length > 0) {
        playContent(movies[0]);
    }
}

function closePlayer() {
    document.getElementById('videoPlayer').classList.remove('active');
    document.getElementById('videoFrame').src = '';
}

function logout() {
    logActivity(currentUser.id, 'Logged out');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function logActivity(userId, action) {
    const activityLog = JSON.parse(localStorage.getItem('activityLog'));
    activityLog.push({
        userId: userId,
        action: action,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

loadContent();