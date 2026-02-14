// Check if user is admin
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'index.html';
}

function loadDashboard() {
    loadStats();
    loadUsers();
    loadActivityLog();
}

function loadStats() {
    const users = JSON.parse(localStorage.getItem('users'));
    let total = 0, active = 0, blocked = 0, suspended = 0;
    
    for (let userId in users) {
        if (users[userId].role === 'user') {
            total++;
            if (users[userId].status === 'active') active++;
            if (users[userId].status === 'blocked') blocked++;
            if (users[userId].status === 'suspended') suspended++;
        }
    }
    
    document.getElementById('totalUsers').textContent = total;
    document.getElementById('activeUsers').textContent = active;
    document.getElementById('blockedUsers').textContent = blocked;
    document.getElementById('suspendedUsers').textContent = suspended;
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
                <td>${user.role}</td>
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

function loadActivityLog() {
    const activityLog = JSON.parse(localStorage.getItem('activityLog'));
    const container = document.getElementById('activityLogContainer');
    container.innerHTML = '';
    
    // Show last 20 activities
    const recentActivities = activityLog.slice(-20).reverse();
    
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
    if (confirm('Are you sure you want to activate ' + userId + '?')) {
        const users = JSON.parse(localStorage.getItem('users'));
        users[userId].status = 'active';
        localStorage.setItem('users', JSON.stringify(users));
        logActivity(userId, 'Account activated by admin');
        loadDashboard();
    }
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

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Load dashboard on page load
loadDashboard();