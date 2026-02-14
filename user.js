// Check if user is logged in
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'index.html';
}

// Display user information
document.getElementById('userName').textContent = currentUser.name;
document.getElementById('userId').textContent = currentUser.id;
document.getElementById('userStatus').textContent = currentUser.status.toUpperCase();

// Load user's activity
function loadUserActivity() {
    const activityLog = JSON.parse(localStorage.getItem('activityLog'));
    const container = document.getElementById('userActivityLog');
    container.innerHTML = '';
    
    const userActivities = activityLog
        .filter(activity => activity.userId === currentUser.id)
        .slice(-10)
        .reverse();
    
    if (userActivities.length === 0) {
        container.innerHTML = '<p>No activity yet.</p>';
        return;
    }
    
    userActivities.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        const date = new Date(activity.timestamp);
        div.innerHTML = `
            <div class="timestamp">${date.toLocaleString()}</div>
            <div class="description">${activity.action}</div>
        `;
        container.appendChild(div);
    });
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

loadUserActivity();