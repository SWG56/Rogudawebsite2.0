-- =====================================================
-- ROGUDA FASHION & ART DESIGN SCHOOL
-- MySQL Database Schema for Student Applications
-- =====================================================
-- 
-- HOW TO USE ON AFRIHOST:
-- 1. Login to cPanel
-- 2. Go to MySQL Databases
-- 3. Create new database (e.g., roguda_applications)
-- 4. Create MySQL user with password
-- 5. Assign user to database with ALL PRIVILEGES
-- 6. Go to phpMyAdmin
-- 7. Select your database
-- 8. Click "SQL" tab
-- 9. Copy and paste this entire file
-- 10. Click "Go" to execute
-- =====================================================

-- Create applications table
CREATE TABLE IF NOT EXISTS `applications` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `application_number` VARCHAR(50) NOT NULL UNIQUE,
  `status` ENUM('pending', 'reviewing', 'accepted', 'rejected', 'waitlist') DEFAULT 'pending',
  
  -- Personal Information
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `id_number` VARCHAR(50) NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `gender` VARCHAR(20),
  `address` TEXT,
  
  -- Program Selection
  `program` VARCHAR(200) NOT NULL,
  `start_date` VARCHAR(50),
  `motivation` TEXT,
  
  -- Educational Background
  `education_level` VARCHAR(100),
  `school_institution` VARCHAR(200),
  `graduation_year` VARCHAR(10),
  `portfolio_link` VARCHAR(500),
  `previous_experience` TEXT,
  
  -- File Uploads (stored filenames)
  `id_copy_file` VARCHAR(255),
  `certificate_file` VARCHAR(255),
  `portfolio_file` VARCHAR(255),
  
  -- Consents (POPIA Compliance)
  `popia_consent` TINYINT(1) DEFAULT 0,
  `marketing_consent` TINYINT(1) DEFAULT 0,
  `accuracy_consent` TINYINT(1) DEFAULT 0,
  
  -- Metadata
  `ip_address` VARCHAR(45),
  `user_agent` VARCHAR(500),
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_application_number` (`application_number`),
  INDEX `idx_status` (`status`),
  INDEX `idx_submitted` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create students table (for accepted applications)
CREATE TABLE IF NOT EXISTS `students` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `application_id` INT(11) NOT NULL,
  `student_number` VARCHAR(50) NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(20),
  `program` VARCHAR(200),
  `enrollment_date` DATE,
  `graduation_date` DATE,
  `status` ENUM('active', 'graduated', 'suspended', 'withdrawn') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE,
  INDEX `idx_student_number` (`student_number`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create admin users table
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin', 'staff') DEFAULT 'staff',
  `is_active` TINYINT(1) DEFAULT 1,
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create application notes table (for tracking communication)
CREATE TABLE IF NOT EXISTS `application_notes` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `application_id` INT(11) NOT NULL,
  `admin_id` INT(11),
  `note` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_id`) REFERENCES `admin_users`(`id`) ON DELETE SET NULL,
  INDEX `idx_application` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create email log table
CREATE TABLE IF NOT EXISTS `email_log` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `application_id` INT(11),
  `recipient_email` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(500),
  `message_preview` TEXT,
  `status` ENUM('sent', 'failed', 'queued') DEFAULT 'queued',
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  FOREIGN KEY (`application_id`) REFERENCES `applications`(`id`) ON DELETE CASCADE,
  INDEX `idx_application` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (CHANGE PASSWORD IMMEDIATELY!)
-- Password: Roguda2026! (hashed with password_hash())
INSERT INTO `admin_users` (`username`, `email`, `password_hash`, `role`) 
VALUES (
  'admin',
  'admin@roguda.co.za',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Change this!
  'super_admin'
);

-- Success message
SELECT 'Database setup complete! ✅' AS Message;
SELECT 'IMPORTANT: Change the default admin password immediately!' AS Warning;
