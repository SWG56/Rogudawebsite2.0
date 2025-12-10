# 🗄️ SQL Database Quick Setup Guide

## 📋 What Was Added

### **New Tables (6):**
1. ✅ `application_submissions` - Full form data capture (23 fields)
2. ✅ `password_resets` - Password recovery tokens
3. ✅ `email_verifications` - Email confirmation system
4. ✅ `user_sessions` - Active session tracking
5. ✅ `incubator_projects` - Student project showcase
6. ✅ `enrollments` - Student program enrollment
7. ✅ `course_progress` - Learning progress tracking

### **Default Admin Accounts:**
- **Super Admin**
  - Username: `admin`
  - Email: `admin@roguda.co.za`
  - Password: `Admin@2025!` ⚠️ **CHANGE IMMEDIATELY**

- **Instructor**
  - Username: `instructor`
  - Email: `instructor@roguda.co.za`
  - Password: `Instructor@2025!` ⚠️ **CHANGE IMMEDIATELY**

### **Database Views (3):**
- `v_active_applications` - Dashboard overview
- `v_student_overview` - Enrollment summary
- `v_marketplace_listings` - Active products

### **Stored Procedures (3):**
- `sp_register_applicant()` - Handle new registrations
- `sp_update_application_status()` - Review applications
- `sp_enroll_student()` - Enroll accepted students

### **Triggers (3):**
- Auto-log application submissions
- Clean expired password reset tokens
- Update product inventory on orders

---

## 🚀 Deployment Steps

### **Step 1: Access Afrihost PHPMyAdmin**
1. Login to Afrihost cPanel
2. Click "phpMyAdmin" icon
3. Select your database from left sidebar

### **Step 2: Execute SQL Setup**
1. Click the **"SQL"** tab at the top
2. Open `SQL_SETUP.sql` in a text editor
3. Copy ALL contents (470+ lines)
4. Paste into SQL query box
5. Click **"Go"** button

### **Step 3: Verify Installation**
Run this query to check all tables:
```sql
SELECT TABLE_NAME, TABLE_ROWS 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME;
```

You should see **15 tables**:
- admin_users
- ai_creations
- applicants
- application_submissions
- course_progress
- email_verifications
- enrollments
- incubator_projects
- orders
- password_resets
- products
- system_logs
- user_sessions

---

## 🔒 Security Checklist

### **Immediately After Deployment:**

1. **Change Admin Passwords**
   ```sql
   -- Update admin password
   UPDATE admin_users 
   SET password = '$2y$10$YOUR_NEW_HASHED_PASSWORD'
   WHERE username = 'admin';
   ```
   
2. **Test Admin Login**
   - Visit: `https://yourdomain.co.za/admin/admin-login.php`
   - Login with: `admin` / `Admin@2025!`
   - Change password immediately

3. **Verify Database Permissions**
   ```sql
   SHOW GRANTS FOR 'roguda_user'@'localhost';
   ```

4. **Enable Query Logging (for 1 week)**
   ```sql
   SET GLOBAL general_log = 'ON';
   ```

---

## 🧪 Testing Queries

### **Test Application Submission:**
```sql
SELECT * FROM application_submissions 
ORDER BY submitted_at DESC 
LIMIT 5;
```

### **Check System Logs:**
```sql
SELECT * FROM system_logs 
WHERE log_type = 'application' 
ORDER BY created_at DESC 
LIMIT 10;
```

### **View Active Students:**
```sql
SELECT * FROM v_student_overview;
```

### **Test Stored Procedure:**
```sql
CALL sp_register_applicant(
  'Test Student',
  'test@example.com',
  '+27123456789',
  'Fashion Design',
  '$2y$10$testHashedPassword'
);
```

---

## 📊 Database Schema Overview

```
applicants (Main User Table)
├── application_submissions (Form Data)
├── enrollments (Active Students)
├── course_progress (Learning Tracking)
├── products (Marketplace Items)
│   └── orders (Transactions)
├── incubator_projects (Student Work)
├── ai_creations (AI Studio Outputs)
├── password_resets (Security)
├── email_verifications (Onboarding)
└── user_sessions (Active Users)

admin_users (Staff Access)
└── system_logs (Audit Trail)
```

---

## 🆘 Troubleshooting

### **Error: "Table already exists"**
- Safe to ignore - uses `CREATE TABLE IF NOT EXISTS`

### **Error: "Duplicate entry for admin"**
- Admin already exists - safe to ignore
- Uses `ON DUPLICATE KEY UPDATE`

### **Error: "Trigger already exists"**
- Drop existing: `DROP TRIGGER IF EXISTS trg_log_application_submission;`
- Re-run SQL file

### **Error: "Access denied for user"**
- Check `includes/config.php` credentials
- Verify user permissions in cPanel

---

## 📈 Performance Optimization

After deployment, run these optimizations:

```sql
-- Analyze tables for query optimization
ANALYZE TABLE applicants, application_submissions, enrollments;

-- Optimize all tables
OPTIMIZE TABLE applicants, application_submissions, products;

-- Check index usage
SHOW INDEX FROM applicants;
```

---

## 🔄 Maintenance Schedule

### **Daily:**
- Monitor `system_logs` for errors
- Check `application_submissions` for new entries

### **Weekly:**
- Run `backup-server.php`
- Clean old session data:
  ```sql
  DELETE FROM user_sessions WHERE expires_at < NOW();
  ```

### **Monthly:**
- Optimize all tables
- Review disk space usage
- Archive old applications (>6 months)

---

## ✅ Setup Complete!

Your database now includes:
- ✅ 15 tables with proper relationships
- ✅ 2 default admin accounts
- ✅ 3 database views for reporting
- ✅ 3 stored procedures for automation
- ✅ 3 triggers for data integrity
- ✅ Full POPIA compliance tracking
- ✅ Session management
- ✅ Password reset functionality
- ✅ Email verification system

**Estimated Setup Time: 5 minutes**

---

## 📞 Support

If you encounter issues:
1. Check error logs: `SELECT * FROM system_logs WHERE log_type = 'error';`
2. Verify table structure: `DESCRIBE table_name;`
3. Contact Afrihost support for database access issues
4. Review `DEPLOYMENT_CHECKLIST.md` for detailed steps

---

**Database Version:** 2.0 Enhanced  
**Last Updated:** December 1, 2025  
**Compatible With:** MySQL 5.7+, MariaDB 10.3+
