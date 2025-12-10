// ======================================
// AUTHENTICATION JAVASCRIPT - auth.js
// Login & Register with localStorage Session
// ======================================

// Login Form Handler
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe')?.checked;
            
            // Validate inputs
            if (!validateEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            if (password.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;
            
            try {
                // Call API endpoint
                const response = await fetch('api/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Create session with API token
                    const session = {
                        email: result.user.email,
                        fullName: result.user.fullName,
                        userType: result.user.userType,
                        token: result.token,
                        loginTime: new Date().toISOString(),
                        rememberMe: rememberMe
                    };
                    
                    Storage.set('roguda_session', session);
                    showToast('Login successful! Redirecting...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    showToast(result.message || 'Login failed', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Login error:', error);
                showToast('Network error. Please try again.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Register Form Handler
function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const popiaConsent = document.getElementById('popiaConsent')?.checked;
            const termsConsent = document.getElementById('termsConsent')?.checked;
            
            // Validation
            if (!fullName || fullName.length < 3) {
                showToast('Please enter your full name', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            if (password.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            if (!popiaConsent || !termsConsent) {
                showToast('Please accept the POPIA Policy and Terms of Service', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating account...';
            submitBtn.disabled = true;
            
            try {
                // Call API endpoint
                const response = await fetch('api/register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName,
                        email,
                        phone,
                        password,
                        userType: 'student',
                        popiaConsent: true
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showToast('Registration successful! Please log in.', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    const errorMsg = result.errors ? result.errors.join(', ') : result.message;
                    showToast(errorMsg || 'Registration failed', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Registration error:', error);
                showToast('Network error. Please try again.', 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
            
            users.push(newUser);
            Storage.set('roguda_users', users);
            
            showToast('Registration successful! Redirecting to login...', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        });
    }
}

// Check if user is logged in
function checkAuth() {
    const session = Storage.get('roguda_session');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Redirect to login if trying to access dashboard without session
    if (currentPage === 'dashboard.html' && !session) {
        showToast('Please login to access your dashboard', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    
    // Redirect to dashboard if already logged in and trying to access login/register
    if ((currentPage === 'login.html' || currentPage === 'register.html') && session) {
        window.location.href = 'dashboard.html';
        return false;
    }
    
    return true;
}

// Logout Handler
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            Storage.remove('roguda_session');
            showToast('Logged out successfully', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
}

// Initialize auth functionality
window.addEventListener('load', () => {
    checkAuth();
    setupLoginForm();
    setupRegisterForm();
    setupLogout();
});
