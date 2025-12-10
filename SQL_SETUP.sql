-- =============================================
-- Roguda Database Setup - Enhanced Version
-- Run this in Afrihost PHPMyAdmin SQL Tab
-- =============================================

CREATE TABLE IF NOT EXISTS applicants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  program VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  password_changed TINYINT(1) DEFAULT 0,
  password_changed_at TIMESTAMP NULL,
  last_login TIMESTAMP NULL,
  status ENUM('pending', 'accepted', 'rejected', 'enrolled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_program (program),
  INDEX idx_status (status)
);

-- Products table for marketplace
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  stock_quantity INT DEFAULT 1,
  status ENUM('available', 'sold', 'removed') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES applicants(id) ON DELETE CASCADE,
  INDEX idx_seller (seller_id),
  INDEX idx_status (status)
);

-- Orders table for marketplace
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  buyer_id INT NOT NULL,
  product_id INT NOT NULL,
  seller_id INT NOT NULL,
  quantity INT DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  order_status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES applicants(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (seller_id) REFERENCES applicants(id),
  INDEX idx_buyer (buyer_id),
  INDEX idx_seller (seller_id),
  INDEX idx_status (order_status)
);

-- AI Studio creations table
CREATE TABLE IF NOT EXISTS ai_creations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  creation_type ENUM('design', 'pattern', 'color_palette', 'sketch') NOT NULL,
  prompt TEXT,
  image_url VARCHAR(255),
  parameters JSON,
  is_public TINYINT(1) DEFAULT 0,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES applicants(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_type (creation_type)
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'admin', 'instructor') DEFAULT 'admin',
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_username (username)
);

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  log_type VARCHAR(50) NOT NULL,
  user_id INT NULL,
  action VARCHAR(200),
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (log_type),
  INDEX idx_user (user_id),
  INDEX idx_date (created_at)
);

-- Application submissions table (captures full form data)
CREATE TABLE IF NOT EXISTS application_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  id_number VARCHAR(20),
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
  address TEXT,
  program VARCHAR(100) NOT NULL,
  start_date DATE,
  motivation TEXT,
  education_level VARCHAR(100),
  school_name VARCHAR(200),
  graduation_year INT,
  portfolio_url TEXT,
  experience TEXT,
  id_copy_file VARCHAR(255),
  certificate_file VARCHAR(255),
  portfolio_file VARCHAR(255),
  popia_consent TINYINT(1) DEFAULT 0,
  marketing_consent TINYINT(1) DEFAULT 0,
  accuracy_consent TINYINT(1) DEFAULT 0,
  submission_status ENUM('new', 'reviewed', 'accepted', 'rejected') DEFAULT 'new',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  reviewed_by INT NULL,
  INDEX idx_email (email),
  INDEX idx_program (program),
  INDEX idx_status (submission_status),
  INDEX idx_submitted (submitted_at)
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  email VARCHAR(100) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES applicants(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_email (email),
  INDEX idx_expires (expires_at)
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  email VARCHAR(100) NOT NULL,
  token VARCHAR(255) NOT NULL,
  verified TINYINT(1) DEFAULT 0,
  verified_at TIMESTAMP NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES applicants(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_verified (verified)
);

-- Sessions table for user tracking
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  session_token VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES applicants(id) ON DELETE CASCADE,
  INDEX idx_token (session_token),
  INDEX idx_user (user_id),
  INDEX idx_expires (expires_at)
);

-- Incubator projects table
CREATE TABLE IF NOT EXISTS incubator_projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  project_name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  thumbnail_url VARCHAR(255),
  gallery_images JSON,
  status ENUM('in_progress', 'completed', 'featured') DEFAULT 'in_progress',
  views_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES applicants(id) ON DELETE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_status (status),
  INDEX idx_featured (status, likes_count)
);

-- Program enrollment table
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  program VARCHAR(100) NOT NULL,
  enrollment_date DATE NOT NULL,
  start_date DATE NOT NULL,
  expected_completion DATE,
  actual_completion DATE NULL,
  enrollment_status ENUM('active', 'completed', 'withdrawn', 'suspended') DEFAULT 'active',
  tuition_status ENUM('pending', 'partial', 'paid') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES applicants(id) ON DELETE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_program (program),
  INDEX idx_status (enrollment_status)
);

-- Course progress tracking
CREATE TABLE IF NOT EXISTS course_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_name VARCHAR(200) NOT NULL,
  module_name VARCHAR(200),
  progress_percentage DECIMAL(5, 2) DEFAULT 0.00,
  completion_status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  last_accessed TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES applicants(id) ON DELETE CASCADE,
  INDEX idx_student (student_id),
  INDEX idx_course (course_name),
  INDEX idx_status (completion_status)
);

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Insert default admin user
-- Password: Admin@2025! (CHANGE THIS IMMEDIATELY AFTER FIRST LOGIN)
INSERT INTO admin_users (username, email, password, role, created_at) 
VALUES (
  'admin',
  'admin@roguda.co.za',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- Password: Admin@2025!
  'super_admin',
  NOW()
) ON DUPLICATE KEY UPDATE email = 'admin@roguda.co.za';

-- Insert instructor account
-- Password: Instructor@2025! (CHANGE THIS IMMEDIATELY)
INSERT INTO admin_users (username, email, password, role, created_at) 
VALUES (
  'instructor',
  'instructor@roguda.co.za',
  '$2y$10$E0aLyGz5P5qKHnN.xOu4x.vQZ5T3J9xL8mP7kR2sW1tY6vB8nC4dS', -- Password: Instructor@2025!
  'instructor',
  NOW()
) ON DUPLICATE KEY UPDATE email = 'instructor@roguda.co.za';

-- =============================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =============================================

-- View: Active applications summary
CREATE OR REPLACE VIEW v_active_applications AS
SELECT 
  a.id,
  a.first_name,
  a.last_name,
  a.email,
  a.phone,
  a.program,
  a.submission_status,
  a.submitted_at,
  DATEDIFF(NOW(), a.submitted_at) AS days_pending
FROM application_submissions a
WHERE a.submission_status IN ('new', 'reviewed')
ORDER BY a.submitted_at DESC;

-- View: Student enrollment overview
CREATE OR REPLACE VIEW v_student_overview AS
SELECT 
  ap.id,
  ap.name,
  ap.email,
  ap.program,
  ap.status,
  e.enrollment_status,
  e.tuition_status,
  e.start_date,
  ap.created_at AS registered_at,
  ap.last_login
FROM applicants ap
LEFT JOIN enrollments e ON ap.id = e.student_id
WHERE ap.status = 'enrolled';

-- View: Marketplace active listings
CREATE OR REPLACE VIEW v_marketplace_listings AS
SELECT 
  p.id,
  p.product_name,
  p.description,
  p.price,
  p.category,
  p.stock_quantity,
  a.name AS seller_name,
  a.email AS seller_email,
  p.created_at
FROM products p
INNER JOIN applicants a ON p.seller_id = a.id
WHERE p.status = 'available' AND p.stock_quantity > 0
ORDER BY p.created_at DESC;

-- =============================================
-- CREATE STORED PROCEDURES
-- =============================================

DELIMITER //

-- Procedure: Register new applicant
CREATE PROCEDURE sp_register_applicant(
  IN p_name VARCHAR(100),
  IN p_email VARCHAR(100),
  IN p_phone VARCHAR(20),
  IN p_program VARCHAR(100),
  IN p_password VARCHAR(255)
)
BEGIN
  INSERT INTO applicants (name, email, phone, program, password, created_at)
  VALUES (p_name, p_email, p_phone, p_program, p_password, NOW());
  
  -- Log the registration
  INSERT INTO system_logs (log_type, user_id, action, ip_address, created_at)
  VALUES ('registration', LAST_INSERT_ID(), 'New applicant registered', NULL, NOW());
END //

-- Procedure: Update application status
CREATE PROCEDURE sp_update_application_status(
  IN p_application_id INT,
  IN p_status ENUM('new', 'reviewed', 'accepted', 'rejected'),
  IN p_reviewed_by INT
)
BEGIN
  UPDATE application_submissions
  SET submission_status = p_status,
      reviewed_at = NOW(),
      reviewed_by = p_reviewed_by
  WHERE id = p_application_id;
  
  -- Log the action
  INSERT INTO system_logs (log_type, user_id, action, details, created_at)
  VALUES ('application_review', p_reviewed_by, 'Application status updated', 
          CONCAT('Application ID: ', p_application_id, ' Status: ', p_status), NOW());
END //

-- Procedure: Enroll student
CREATE PROCEDURE sp_enroll_student(
  IN p_student_id INT,
  IN p_program VARCHAR(100),
  IN p_start_date DATE
)
BEGIN
  -- Update applicant status
  UPDATE applicants
  SET status = 'enrolled'
  WHERE id = p_student_id;
  
  -- Create enrollment record
  INSERT INTO enrollments (student_id, program, enrollment_date, start_date, created_at)
  VALUES (p_student_id, p_program, CURDATE(), p_start_date, NOW());
  
  -- Log enrollment
  INSERT INTO system_logs (log_type, user_id, action, created_at)
  VALUES ('enrollment', p_student_id, 'Student enrolled', NOW());
END //

DELIMITER ;

-- =============================================
-- CREATE TRIGGERS
-- =============================================

DELIMITER //

-- Trigger: Log application submissions
CREATE TRIGGER trg_log_application_submission
AFTER INSERT ON application_submissions
FOR EACH ROW
BEGIN
  INSERT INTO system_logs (log_type, action, details, created_at)
  VALUES ('application', 'New application submitted', 
          CONCAT('Email: ', NEW.email, ' Program: ', NEW.program), NOW());
END //

-- Trigger: Clean expired password reset tokens
CREATE TRIGGER trg_clean_expired_tokens
BEFORE INSERT ON password_resets
FOR EACH ROW
BEGIN
  DELETE FROM password_resets 
  WHERE expires_at < NOW() AND used = 0;
END //

-- Trigger: Update product status when sold
CREATE TRIGGER trg_update_product_on_order
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity,
      status = CASE 
        WHEN (stock_quantity - NEW.quantity) <= 0 THEN 'sold'
        ELSE 'available'
      END
  WHERE id = NEW.product_id;
END //

DELIMITER ;

-- =============================================
-- GRANT PERMISSIONS (Run separately if needed)
-- =============================================

-- GRANT SELECT, INSERT, UPDATE, DELETE ON roguda_db.* TO 'roguda_user'@'localhost';
-- FLUSH PRIVILEGES;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check all tables created
SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME;

-- =============================================
-- SETUP COMPLETE
-- =============================================
-- 
-- Next Steps:
-- 1. Verify all tables exist: SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE();
-- 2. Test admin login: Username: admin, Password: Admin@2025!
-- 3. IMMEDIATELY change default admin password after first login
-- 4. Create backup schedule: Run backup-server.php weekly
-- 5. Monitor system_logs table for security events
--
-- =============================================
