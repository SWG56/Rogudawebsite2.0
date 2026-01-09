-- ============================
-- Create Database (optional)
-- ============================
CREATE DATABASE IF NOT EXISTS rogudat3b7y0_admissions
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE rogudat3b7y0_admissions;


-- ============================
-- 1. Applicants
-- ============================
CREATE TABLE IF NOT EXISTS applicants (
    applicant_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    id_number VARCHAR(50) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================
-- 2. Programs
-- ============================
CREATE TABLE IF NOT EXISTS programs (
    program_id INT AUTO_INCREMENT PRIMARY KEY,
    program_name VARCHAR(200) NOT NULL,
    start_date DATE
) ENGINE=InnoDB;

-- ============================
-- 3. Applications
-- ============================
CREATE TABLE IF NOT EXISTS applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    program_id INT NOT NULL,
    motivation TEXT,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_applications_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicants(applicant_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_applications_program
        FOREIGN KEY (program_id)
        REFERENCES programs(program_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================
-- 4. Education
-- ============================
CREATE TABLE IF NOT EXISTS education (
    education_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    education_level VARCHAR(100),
    institution VARCHAR(200),
    graduation_year YEAR,
    previous_experience TEXT,
    portfolio_link VARCHAR(500),

    CONSTRAINT fk_education_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicants(applicant_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================
-- 5. Applicant Files
-- ============================
CREATE TABLE IF NOT EXISTS applicant_files (
    file_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    file_type ENUM('id_copy', 'certificate', 'portfolio') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_files_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicants(applicant_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================
-- 6. Consents (POPIA)
-- ============================
CREATE TABLE IF NOT EXISTS consents (
    consent_id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    popia_consent TINYINT(1) DEFAULT 0,
    marketing_consent TINYINT(1) DEFAULT 0,
    accuracy_consent TINYINT(1) DEFAULT 0,
    consent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_consents_applicant
        FOREIGN KEY (applicant_id)
        REFERENCES applicants(applicant_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;
