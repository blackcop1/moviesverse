// Mock database (in production, this would be on the server)
const users = {
    'admin': {
        id: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Administrator'
    },
    'user1': {
        id: 'user1',
        password: 'user123',
        role: 'user',
        name: 'John Doe',
        status: 'active'
    },
    'user2': {
        id: 'user2',
        password: 'user123',
        role: 'user',
        name: 'Jane Smith',
        status: 'active'
    }
};

// Store in localStorage (simulating database)
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
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
            window.location.href = 'user.html';
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