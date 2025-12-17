<?php
// =====================================================
// ROGUDA FASHION & ART DESIGN SCHOOL
// Database Configuration File
// =====================================================
// 
// INSTRUCTIONS FOR AFRIHOST SETUP:
// 1. Rename this file from config-sample.php to config.php
// 2. Fill in your Afrihost MySQL credentials below
// 3. Keep this file secure (add to .gitignore)
// =====================================================

// Database Configuration
define('DB_HOST', 'localhost');                    // Usually 'localhost' on Afrihost
define('DB_NAME', 'your_database_name');          // Get from cPanel → MySQL Databases
define('DB_USER', 'your_database_user');          // Get from cPanel → MySQL Databases
define('DB_PASS', 'your_database_password');      // Password you set in cPanel
define('DB_CHARSET', 'utf8mb4');

// Create database connection
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        die("Sorry, we're experiencing technical difficulties. Please try again later.");
    }
    
    // Set charset
    $conn->set_charset(DB_CHARSET);
    
} catch (Exception $e) {
    error_log("Database error: " . $e->getMessage());
    die("Database connection failed. Please contact support.");
}

// Site Configuration
define('SITE_URL', 'https://yourdomain.co.za');   // Your Afrihost domain
define('SITE_NAME', 'ROGUDA Fashion & Art Design School');
define('ADMIN_EMAIL', 'admin@yourdomain.co.za');  // Admin email for notifications

// File Upload Settings
define('UPLOAD_MAX_SIZE', 5242880);  // 5MB in bytes
define('UPLOAD_ALLOWED_TYPES', ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']);

// Timezone
date_default_timezone_set('Africa/Johannesburg');

// Error Reporting (set to 0 in production)
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Session Settings
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 1);  // Requires HTTPS

?>
