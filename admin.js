// Check if user is admin
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'index.html';
}

function loadDashboard() {
    loadStats();
    loadUsers();
    loadContent();
    loadActivityLog();
}

function loadStats() {
    const users = JSON.parse(localStorage.getItem('users'));
    const movies = JSON.parse(localStorage.getItem('movies'));
    
    let total = 0, active = 0, blocked = 0;
    
    for (let userId in users) {
        if (users[userId].role === 'user') {
            total++;
            if (users[userId].status === 'active') active++;
            if (users[userId].status === 'blocked') blocked++;
        }
    }
    
    document.getElementById('totalUsers').textContent = total;
    document.getElementById('activeUsers').textContent = active;
    document.getElementById('blockedUsers').textContent = blocked;
    document.getElementById('totalContent').textContent = movies.length;
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users'));
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    
    for (let userId in users) {
        const user = users[userId];
        if (user.role === 'user') {
            const row = document.createElement('tr');
            const statusClass = `status-${user.status}`;
            
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td class="${statusClass}">${user.status.toUpperCase()}</td>
                <td class="action-buttons">
                    <button class="btn-action btn-reset" onclick="resetPassword('${user.id}')">Reset Password</button>
                    ${user.status !== 'blocked' ? 
                        `<button class="btn-action btn-block" onclick="blockUser('${user.id}')">Block</button>` :
                        `<button class="btn-action btn-activate" onclick="activateUser('${user.id}')">Activate</button>`
                    }
                    ${user.status !== 'suspended' ? 
                        `<button class="btn-action btn-suspend" onclick="suspendUser('${user.id}')">Suspend</button>` :
                        `<button class="btn-action btn-activate" onclick="activateUser('${user.id}')">Activate</button>`
                    }
                </td>
            `;
            tbody.appendChild(row);
        }
    }
}

function loadContent() {
    const movies = JSON.parse(localStorage.getItem('movies'));
    const tbody = document.getElementById('contentTableBody');
    tbody.innerHTML = '';
    
    movies.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.type.toUpperCase()}</td>
            <td>${item.year}</td>
            <td>★ ${item.rating}</td>
            <td class="action-buttons">
                <button class="btn-action btn-block" onclick="deleteContent(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadActivityLog() {
    const activityLog = JSON.parse(localStorage.getItem('activityLog'));
    const container = document.getElementById('activityLogContainer');
    container.innerHTML = '';
    
    const recentActivities = activityLog.slice(-30).reverse();
    
    if (recentActivities.length === 0) {
        container.innerHTML = '<p style="color: #999;">No activity yet.</p>';
        return;
    }
    
    recentActivities.forEach(activity => {
        const div = document.createElement('div');
        div.className = 'activity-item';
        const date = new Date(activity.timestamp);
        div.innerHTML = `
            <div class="timestamp">${date.toLocaleString()}</div>
            <div class="description"><strong>${activity.userId}</strong> - ${activity.action}</div>
        `;
        container.appendChild(div);
    });
}

function resetPassword(userId) {
    const newPassword = prompt('Enter new password for ' + userId + ':');
    if (newPassword) {
        const users = JSON.parse(localStorage.getItem('users'));
        users[userId].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        logActivity(userId, 'Password reset by admin');
        alert('Password reset successfully!');
        loadDashboard();
    }
}

function blockUser(userId) {
    if (confirm('Are you sure you want to block ' + userId + '?')) {
        const users = JSON.parse(localStorage.getItem('users'));
        users[userId].status = 'blocked';
        localStorage.setItem('users', JSON.stringify(users));
        logActivity(userId, 'Account blocked by admin');
        loadDashboard();
    }
}

function suspendUser(userId) {
    if (confirm('Are you sure you want to suspend ' + userId + '?')) {
        const users = JSON.parse(localStorage.getItem('users'));
        users[userId].status = 'suspended';
        localStorage.setItem('users', JSON.stringify(users));
        logActivity(userId, 'Account suspended by admin');
        loadDashboard();
    }
}

function activateUser(userId) {
    const users = JSON.parse(localStorage.getItem('users'));
    users[userId].status = 'active';
    localStorage.setItem('users', JSON.stringify(users));
    logActivity(userId, 'Account activated by admin');
    loadDashboard();
}

function showAddContentModal() {
    document.getElementById('addContentModal').classList.add('active');
}

function closeModal() {
    document.getElementById('addContentModal').classList.remove('active');
    document.getElementById('addContentForm').reset();
}

document.getElementById('addContentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const movies = JSON.parse(localStorage.getItem('movies'));
    const newContent = {
        id: movies.length + 1,
        title: document.getElementById('contentTitle').value,
        type: document.getElementById('contentType').value,
        year: parseInt(document.getElementById('contentYear').value),
        rating: document.getElementById('contentRating').value,
        description: document.getElementById('contentDescription').value,
        videoUrl: document.getElementById('contentVideoUrl').value,
        thumbnail: `https://via.placeholder.com/200x300/1a1a1a/e50914?text=${encodeURIComponent(document.getElementById('contentTitle').value)}`
    };
    
    movies.push(newContent);
    localStorage.setItem('movies', JSON.stringify(movies));
    logActivity('admin', `Added new content: ${newContent.title}`);
    
    closeModal();
    loadDashboard();
    alert('Content added successfully!');
});

function deleteContent(index) {
    if (confirm('Are you sure you want to delete this content?')) {
        const movies = JSON.parse(localStorage.getItem('movies'));
        const deleted = movies.splice(index, 1);
        localStorage.setItem('movies', JSON.stringify(movies));
        logActivity('admin', `Deleted content: ${deleted[0].title}`);
        loadDashboard();
    }
}

function logout() {
    logActivity('admin', 'Logged out');
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

loadDashboard();