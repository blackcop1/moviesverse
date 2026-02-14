// Signup form handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        const address = document.getElementById('address').value;
        const userId = document.getElementById('signupUserId').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const signupMessage = document.getElementById('signupMessage');
        
        // Clear previous messages
        signupMessage.textContent = '';
        signupMessage.style.color = '#e87c03';
        
        // Validation
        if (password !== confirmPassword) {
            signupMessage.textContent = 'Passwords do not match!';
            return;
        }
        
        if (password.length < 6) {
            signupMessage.textContent = 'Password must be at least 6 characters long!';
            return;
        }
        
        if (mobile.length !== 10 || isNaN(mobile)) {
            signupMessage.textContent = 'Please enter a valid 10-digit mobile number!';
            return;
        }
        
        // Get existing users
        const storedUsers = JSON.parse(localStorage.getItem('users')) || {};
        
        // Check if user ID already exists
        if (storedUsers[userId]) {
            signupMessage.textContent = 'User ID already exists! Please choose a different one.';
            return;
        }
        
        // Check if email already exists
        for (let existingUserId in storedUsers) {
            if (storedUsers[existingUserId].email === email) {
                signupMessage.textContent = 'Email already registered! Please use a different email.';
                return;
            }
        }
        
        // Create new user
        const newUser = {
            id: userId,
            password: password,
            role: 'user',
            name: fullName,
            email: email,
            mobile: mobile,
            address: address,
            status: 'active',
            createdAt: new Date().toISOString()
        };
        
        // Add user to storage
        storedUsers[userId] = newUser;
        localStorage.setItem('users', JSON.stringify(storedUsers));
        
        // Log activity
        logActivity(userId, 'Account created');
        
        // Show success message
        signupMessage.style.color = '#46d369';
        signupMessage.textContent = 'Account created successfully! Redirecting to login...';
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
}

function logActivity(userId, action) {
    const activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];
    activityLog.push({
        userId: userId,
        action: action,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}