<?php
session_start();
require_once '../includes/config.php';
require_once '../includes/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Check admin credentials from database
    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ? AND is_active = 1");
    $stmt->execute([$username]);
    $admin = $stmt->fetch();
    
    if ($admin && password_verify($password, $admin['password_hash'])) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_user'] = $username;
        $_SESSION['admin_id'] = $admin['id'];
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Invalid credentials";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login | Roguda</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/theme.css">
    <style>
        .admin-login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--ivory) 0%, var(--gold) 100%);
        }
        .login-card {
            max-width: 400px;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .login-title {
            font-family: var(--font-title);
            color: var(--gold);
            font-size: 2rem;
            margin-bottom: 0.5rem;
            text-align: center;
        }
        .login-subtitle {
            color: var(--earth);
            text-align: center;
            margin-bottom: 2rem;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: var(--charcoal);
        }
        .form-group input {
            width: 100%;
            padding: 0.9rem;
            border: 2px solid rgba(199, 158, 79, 0.3);
            border-radius: 8px;
            font-size: 1rem;
        }
        .form-group input:focus {
            outline: none;
            border-color: var(--gold);
        }
        .error-message {
            background: rgba(220, 53, 69, 0.1);
            color: #721c24;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="admin-login-container">
        <div class="login-card">
            <h1 class="login-title">🔐 Admin Login</h1>
            <p class="login-subtitle">Roguda Management Portal</p>
            
            <?php if (isset($error)): ?>
                <div class="error-message"><?php echo $error; ?></div>
            <?php endif; ?>
            
            <form method="POST">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="btn-primary" style="width: 100%; padding: 1rem;">Login</button>
            </form>
            
            <div style="text-align: center; margin-top: 1.5rem;">
                <a href="../index.html" style="color: var(--gold);">← Back to Website</a>
            </div>
        </div>
    </div>
</body>
</html>

-- SQL Script to Create Table and Insert Admin User --
CREATE TABLE admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert your new admin account with a secure password
INSERT INTO admin_users (username, password_hash, email) 
VALUES ('admin', '$2y$10$YourNewHashedPasswordHere', 'admin@roguda.co.za');

<?php
echo password_hash('YourNewSecurePassword', PASSWORD_DEFAULT);
?>
