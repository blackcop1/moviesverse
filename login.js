// Initialize database with demo data
const initialUsers = {
    'admin': {
        id: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Administrator',
        email: 'admin@streamflix.com'
    },
    'user1': {
        id: 'user1',
        password: 'user123',
        role: 'user',
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active'
    },
    'user2': {
        id: 'user2',
        password: 'user123',
        role: 'user',
        name: 'Jane Smith',
        email: 'jane@example.com',
        status: 'active'
    }
};

const initialMovies = [
    {
        id: 1,
        title: "The Dark Knight",
        type: "movie",
        year: 2008,
        rating: "9.0",
        duration: "2h 32m",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
        thumbnail: "https://via.placeholder.com/200x300/1a1a1a/e50914?text=Dark+Knight",
        videoUrl: "https://www.youtube.com/embed/EXeTwQWrcwY"
    },
    {
        id: 2,
        title: "Inception",
        type: "movie",
        year: 2010,
        rating: "8.8",
        duration: "2h 28m",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.",
        thumbnail: "https://via.placeholder.com/200x300/1a1a1a/e50914?text=Inception",
        videoUrl: "https://www.youtube.com/embed/YoHD9XEInc0"
    },
    {
        id: 3,
        title: "Breaking Bad",
        type: "series",
        year: 2008,
        rating: "9.5",
        seasons: "5 Seasons",
        description: "A high school chemistry teacher turned methamphetamine producer partners with a former student.",
        thumbnail: "https://via.placeholder.com/200x300/1a1a1a/e50914?text=Breaking+Bad",
        videoUrl: "https://www.youtube.com/embed/HhesaQXLuRY"
    },
    {
        id: 4,
        title: "Stranger Things",
        type: "series",
        year: 2016,
        rating: "8.7",
        seasons: "4 Seasons",
        description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
        thumbnail: "https://via.placeholder.com/200x300/1a1a1a/e50914?text=Stranger+Things",
        videoUrl: "https://www.youtube.com/embed/b9EkMc79ZSU"
    },
    {
        id: 5,
        title: "Interstellar",
        type: "movie",
        year: 2014,
        rating: "8.6",
        duration: "2h 49m",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        thumbnail: "https://via.placeholder.com/200x300/1a1a1a/e50914?text=Interstellar",
        videoUrl: "https://www.youtube.com/embed/zSWdZVtXT7E"
    },
    {
        id: 6,
        title: "The Witcher",
        type: "series",
        year: 2019,
        rating: "8.2",
        seasons: "3 Seasons",
        description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
        thumbnail: "https://via.placeholder.com/200x300/1a1a1a/e50914?text=The+Witcher",
        videoUrl: "https://www.youtube.com/embed/ndl1W4ltcmg"
    }
];

// Initialize localStorage
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(initialUsers));
}

if (!localStorage.getItem('movies')) {
    localStorage.setItem('movies', JSON.stringify(initialMovies));
}

if (!localStorage.getItem('activityLog')) {
    localStorage.setItem('activityLog', JSON.stringify([]));
}

// Login form handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const userId = document.getElementById('userId').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        
        const storedUsers = JSON.parse(localStorage.getItem('users'));
        const user = storedUsers[userId];
        
        if (!user) {
            errorMessage.textContent = 'User ID not found!';
            return;
        }
        
        if (user.status === 'blocked') {
            errorMessage.textContent = 'Your account has been blocked. Contact administrator.';
            return;
        }
        
        if (user.status === 'suspended') {
            errorMessage.textContent = 'Your account is suspended. Contact administrator.';
            return;
        }
        
        if (user.password !== password) {
            errorMessage.textContent = 'Incorrect password!';
            logActivity(userId, 'Failed login attempt');
            return;
        }
        
        // Successful login
        localStorage.setItem('currentUser', JSON.stringify(user));
        logActivity(userId, 'Logged in successfully');
        
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'home.html';
        }
    });
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