# 🚀 Roguda Website Deployment Checklist

## ✅ Pre-Deployment Verification

### Step 1: Database Setup in Afrihost
- [ ] **Login to Afrihost cPanel**
- [ ] **Navigate to MySQL Databases**
- [ ] **Create Database**: `roguda_db`
- [ ] **Create Database User** with strong password
- [ ] **Grant ALL PRIVILEGES** to user on `roguda_db`
- [ ] **Note down credentials**:
  - Username: `_____________`
  - Password: `_____________`

### Step 2: Run SQL Table Creation
- [ ] **Open PHPMyAdmin** from cPanel
- [ ] **Select `roguda_db`** from left sidebar
- [ ] **Click "SQL" tab**
- [ ] **Paste and Execute** the following:

```sql
CREATE TABLE applicants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  program VARCHAR(100),
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] **Verify table created** (should see "applicants" in table list)

### Step 3: Update Database Credentials
- [ ] **Open**: `includes/database.php`
- [ ] **Replace placeholders** with your actual credentials:

```php
<?php
$host = "localhost";
$user = "YOUR_ACTUAL_USERNAME";  // Replace this
$pass = "YOUR_ACTUAL_PASSWORD";  // Replace this
$db   = "roguda_db";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  die("Database connection failed: " . $conn->connect_error);
}
?>
```

### Step 4: Update Email Settings
- [ ] **Open**: `includes/mailer.php`
- [ ] **Line 19**: Update login URL
  - Change: `https://yourdomain.co.za/roguda/login.html`
  - To: `https://YOUR-ACTUAL-DOMAIN.co.za/login.html`
- [ ] **Line 20**: Update "From" email
  - Change: `admissions@yourdomain.co.za`
  - To: `admissions@YOUR-ACTUAL-DOMAIN.co.za`

### Step 5: Test Email Functionality
Create a test file: `test_email.php`

```php
<?php
$to = "YOUR_EMAIL@gmail.com";  // Your actual email
$subject = "Test Email from Roguda";
$message = "If you receive this, PHP mail() is working!";
$headers = "From: admissions@YOUR-DOMAIN.co.za";

if(mail($to, $subject, $message, $headers)) {
    echo "✅ Email sent successfully! Check your inbox.";
} else {
    echo "❌ Email failed. Contact Afrihost support.";
}
?>
```

- [ ] **Upload** `test_email.php` to root folder
- [ ] **Visit** in browser: `https://YOUR-DOMAIN.co.za/test_email.php`
- [ ] **Check inbox** for test email
- [ ] **Delete** `test_email.php` after testing

### Step 6: Verify Form Actions
- [ ] **apply.html** (Line 25): `action="includes/mailer.php"` ✅ (Already correct)
- [ ] **login.html** (Line 19): `action="includes/auth.php"` ✅ (Already correct)

### Step 7: POPIA Consent Verification
- [ ] **Open**: `apply.html` in browser
- [ ] **Verify** POPIA checkbox is visible
- [ ] **Try submitting** without checking box (should fail)
- [ ] **Check** the box and submit (should work)

### Step 8: Password Hashing Test
- [ ] **Submit a test application** via `apply.html`
- [ ] **Go to PHPMyAdmin** → `applicants` table → "Browse"
- [ ] **Check password column**: Should see long gibberish string like:
  ```
  $2y$10$abcdefg1234567890...
  ```
  (NOT plain text like "ABC123XY")
- [ ] **If plain text**: Password hashing is broken, check PHP version (needs 5.5+)

### Step 9: Login Flow Test
- [ ] **Submit application** with test email
- [ ] **Check email** for temporary password
- [ ] **Go to**: `login.html`
- [ ] **Enter credentials** from email
- [ ] **Verify redirect** to `dashboard.html` ✅ (auth.php redirects correctly)
- [ ] **Check dashboard** displays welcome message

### Step 10: File Permissions (Afrihost)
After uploading via FTP/cPanel File Manager:

- [ ] **Folders**: `chmod 755`
  - `includes/`
  - `assets/`
  - `docs/`
  
- [ ] **PHP Files**: `chmod 644`
  - `includes/database.php`
  - `includes/mailer.php`
  - `includes/auth.php`

- [ ] **HTML/CSS/JS**: `chmod 644`
  - All `.html`, `.css`, `.js` files

### Step 11: .htaccess SSL Redirect
Create `.htaccess` in root folder:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Error Pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html
```

- [ ] **Upload** `.htaccess` to root folder
- [ ] **Test**: Visit `http://YOUR-DOMAIN.co.za` (should redirect to `https://`)

---

## 🎯 Final Verification

### Complete Application Flow
1. [ ] Visit `apply.html`
2. [ ] Fill out form (Name, Email, Program)
3. [ ] Check POPIA consent box
4. [ ] Submit form
5. [ ] Redirects to `apply-success.html`
6. [ ] Email received with credentials
7. [ ] Login at `login.html` with temp password
8. [ ] Redirects to `dashboard.html`
9. [ ] Dashboard displays welcome message

### Database Check
- [ ] Open PHPMyAdmin → `applicants` table
- [ ] **Verify columns**: `id`, `name`, `email`, `program`, `password`, `created_at`
- [ ] **Check password**: Should be hashed (60+ character string starting with `$2y$`)
- [ ] **Check created_at**: Should show timestamp of submission

---

## 🔧 Troubleshooting

### "Database connection failed"
- Check `includes/database.php` credentials
- Verify database name is exactly `roguda_db`
- Check MySQL user has privileges on database

### "Email not sent"
- Test with `test_email.php` first
- Check "From" email matches your domain
- Contact Afrihost if mail() still fails

### "Error: Duplicate entry for key 'email'"
- Email already exists in database
- Use a different email OR delete record from PHPMyAdmin

### "Password not working"
- Check email for exact password (case-sensitive)
- Copy-paste instead of typing
- Check spam folder for credential email

### "Form doesn't submit"
- Check browser console (F12) for JavaScript errors
- Verify POPIA checkbox is checked
- Check all required fields are filled

---

## 📝 Important Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `apply.html` | Application form | ✅ Points to `includes/mailer.php` |
| `login.html` | Login form | ✅ Points to `includes/auth.php` |
| `includes/database.php` | DB connection | ⚠️ **UPDATE CREDENTIALS** |
| `includes/mailer.php` | Form handler | ⚠️ **UPDATE EMAIL DOMAIN** |
| `includes/auth.php` | Login handler | ✅ Redirects to `dashboard.html` |
| `dashboard.html` | Student portal | ✅ Ready |
| `apply-success.html` | Success page | ✅ Ready |
| `SQL_SETUP.sql` | Database schema | ✅ Ready to run |

---

## 🎨 UI/UX Status
✅ **All pages updated to `theme.css`**
- Consistent charcoal/gold/ivory palette
- Removed `dark-theme` class from all pages
- Responsive design for mobile/tablet
- Auth pages with split-screen layout

---

## 📧 Sample Email Output

When a user applies, they receive:

```
Subject: Welcome to Roguda Fashion & Art Design School

Dear [Name],

Thank you for applying for the [Program] program.

Your temporary login credentials are:
Email: [email@example.com]
Password: ABC123XY

Login here: https://YOUR-DOMAIN.co.za/login.html

For privacy protection, please change your password after logging in.

Regards,
ROGUDA Admissions Team
```

---

## ✅ Deployment Complete When:
- [ ] All 11 steps above are checked ✅
- [ ] Test application submitted successfully
- [ ] Test login works and redirects to dashboard
- [ ] Passwords are hashed in database
- [ ] Email credentials received
- [ ] HTTPS redirect working
- [ ] No PHP errors displayed

**Last Updated**: November 28, 2025
**Version**: 3.0 (Unified Theme)
