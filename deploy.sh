#!/bin/bash
# ========================================
# DEPLOYMENT SCRIPT FOR AFRIHOST HOSTING
# ========================================
# This script automates the deployment process
# Run this on your local machine before uploading

echo "========================================="
echo "Roguda Website Deployment Preparation"
echo "========================================="

# 1. Check if required files exist
echo ""
echo "Step 1: Checking required files..."
required_files=(
    "index.html"
    "apply.html"
    "login.html"
    "dashboard.html"
    "includes/config.php"
    "includes/database.php"
    "includes/mailer.php"
    "includes/auth.php"
    "includes/logout.php"
    "includes/change-password.php"
    "SQL_SETUP.sql"
    ".htaccess"
)

missing_files=0
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $file"
        ((missing_files++))
    else
        echo "✅ Found: $file"
    fi
done

if [ $missing_files -gt 0 ]; then
    echo ""
    echo "⚠️  Warning: $missing_files required file(s) missing!"
    exit 1
fi

# 2. Check configuration
echo ""
echo "Step 2: Checking configuration..."
if grep -q "YOUR_AFRIHOST_DB_USERNAME" includes/config.php; then
    echo "⚠️  WARNING: Database credentials not updated in config.php"
    echo "   Please update DB_USER and DB_PASS before deployment"
fi

if grep -q "YOUR_ACTUAL_DOMAIN" includes/config.php; then
    echo "⚠️  WARNING: Domain not updated in config.php"
    echo "   Please update SITE_URL before deployment"
fi

# 3. Create deployment package
echo ""
echo "Step 3: Creating deployment package..."
timestamp=$(date +%Y%m%d_%H%M%S)
deploy_dir="roguda_deploy_${timestamp}"
mkdir -p "$deploy_dir"

# Copy all files except git and development files
rsync -av --progress . "$deploy_dir" \
    --exclude=".git" \
    --exclude="node_modules" \
    --exclude=".gitignore" \
    --exclude="*.md" \
    --exclude="deploy.sh" \
    --exclude="roguda_deploy_*"

echo ""
echo "✅ Deployment package created: $deploy_dir"

# 4. Create deployment checklist
cat > "${deploy_dir}/DEPLOY_CHECKLIST.txt" << 'EOF'
========================================
ROGUDA DEPLOYMENT CHECKLIST
========================================

□ BEFORE UPLOAD:
  □ Update includes/config.php with Afrihost database credentials
  □ Update includes/config.php with actual domain name
  □ Update SITE_EMAIL and ADMIN_EMAIL in config.php
  □ Test email-test.php locally

□ AFRIHOST CPANEL SETUP:
  □ Login to Afrihost cPanel
  □ Go to "MySQL Databases"
  □ Create database: roguda_db
  □ Create database user with strong password
  □ Grant ALL PRIVILEGES to user on roguda_db
  □ Note down: Database Name, Username, Password

□ UPLOAD FILES:
  □ Connect via FTP or use cPanel File Manager
  □ Upload all files to public_html/ (or subdirectory)
  □ Verify file permissions (644 for files, 755 for directories)
  □ Ensure includes/ folder is NOT publicly accessible

□ DATABASE SETUP:
  □ Go to cPanel → phpMyAdmin
  □ Select roguda_db database
  □ Go to "SQL" tab
  □ Copy content from SQL_SETUP.sql
  □ Execute SQL commands
  □ Verify tables created: applicants, products, orders, etc.

□ TESTING:
  □ Visit: yourdomain.co.za/includes/email-test.php
  □ Update test email and run test
  □ Test application form submission
  □ Test login functionality
  □ Test password change
  □ Test logout
  □ Test admin login: yourdomain.co.za/admin/admin-login.php
  □ Check POPIA consent flow

□ SSL CERTIFICATE:
  □ In cPanel, go to "SSL/TLS Status"
  □ Enable AutoSSL or install Let's Encrypt certificate
  □ Verify HTTPS redirection works

□ SECURITY:
  □ Verify .htaccess is active
  □ Test that config.php cannot be accessed via browser
  □ Change default admin password
  □ Set up regular backups

□ POST-DEPLOYMENT:
  □ Remove email-test.php from public access
  □ Monitor error logs: cPanel → Error Logs
  □ Set up email forwarding for admissions@yourdomain.co.za
  □ Test application deadline enforcement

========================================
SUPPORT CONTACTS
========================================
Afrihost Support: support@afrihost.com
Phone: 087 943 7467
Email Support: info@roguda.co.za

========================================
EOF

echo ""
echo "✅ Deployment checklist created"

# 5. Create ZIP archive
echo ""
echo "Step 4: Creating ZIP archive..."
zip -r "${deploy_dir}.zip" "$deploy_dir" > /dev/null
echo "✅ ZIP archive created: ${deploy_dir}.zip"

# 6. Final instructions
echo ""
echo "========================================="
echo "DEPLOYMENT PACKAGE READY!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Review and update includes/config.php"
echo "2. Upload ${deploy_dir}.zip to Afrihost cPanel"
echo "3. Extract in public_html directory"
echo "4. Follow DEPLOY_CHECKLIST.txt"
echo ""
echo "Files ready in: $deploy_dir"
echo "Archive ready: ${deploy_dir}.zip"
echo ""
echo "========================================="
