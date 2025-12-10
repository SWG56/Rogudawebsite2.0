# 📚 Moodle LMS Integration Guide for Roguda

## Overview
Roguda now has full Moodle Learning Management System integration for both students and administrators. This guide will help you set up and configure the integration.

---

## ✅ What's Been Added

### Student Dashboard Features
- **Moodle Course Portal** - Embedded iframe showing full Moodle interface
- **Course Quick Access** - Direct links to enrolled courses
- **Real-time Stats** - Enrolled courses, completed assignments, pending tasks, average grade
- **Fullscreen Mode** - Toggle fullscreen for immersive learning
- **New Tab Access** - Open Moodle in separate window

### Admin Dashboard Features
- **Moodle Admin Panel** - Embedded admin interface
- **System Statistics** - Active students, courses, pending grading, average grades
- **Quick Actions** - Create assignments, grade submissions, upload resources, view analytics
- **Instructor Tools** - Direct access to course management, user management, reports
- **API Integration** - Real-time data sync with Moodle

---

## 🔧 Setup Instructions

### Step 1: Install Moodle
1. Download Moodle from https://moodle.org/
2. Install on your server (recommended: moodle.roguda.co.za subdomain)
3. Complete Moodle setup wizard
4. Configure site settings and appearance

### Step 2: Enable Moodle Web Services
1. Go to: **Site administration → Advanced features**
2. Enable "Enable web services"
3. Save changes

### Step 3: Create Web Service Tokens

#### For Student API:
1. **Site administration → Plugins → Web services → External services**
2. Click "Add" to create new service
3. Name: "Roguda Student Portal"
4. Enable: ✓
5. Add functions:
   - `core_enrol_get_users_courses`
   - `core_completion_get_course_completion_status`
   - `gradereport_user_get_grade_items`
   - `mod_assign_get_assignments`
   - `core_user_get_users_by_field`

#### For Admin API:
1. Create another service: "Roguda Admin Portal"
2. Add admin functions:
   - `core_user_get_users`
   - `core_course_get_courses`
   - `core_enrol_get_enrolled_users`
   - `mod_assign_get_assignments`
   - `core_course_create_courses`
   - `core_user_create_users`

### Step 4: Generate API Tokens
1. **Site administration → Plugins → Web services → Manage tokens**
2. Click "Add"
3. Select user (create service account if needed)
4. Select service (Student or Admin)
5. Copy the generated token

### Step 5: Configure Roguda Integration

#### Update Student API (`api/moodle-stats.php`):
```php
define('MOODLE_URL', 'https://moodle.roguda.co.za');
define('MOODLE_TOKEN', 'YOUR_STUDENT_SERVICE_TOKEN_HERE');
```

#### Update Admin API (`api/moodle-admin-stats.php`):
```php
define('MOODLE_URL', 'https://moodle.roguda.co.za');
define('MOODLE_ADMIN_TOKEN', 'YOUR_ADMIN_SERVICE_TOKEN_HERE');
```

#### Update Student Dashboard (`dashboard.html`):
Find the iframe section and update:
```javascript
<iframe 
    id="moodleFrame"
    src="https://moodle.roguda.co.za" 
    ...
></iframe>
```

Update course URLs in JavaScript:
```javascript
const courseUrls = {
    'fashion-fundamentals': 'https://moodle.roguda.co.za/course/view.php?id=1',
    'pattern-design': 'https://moodle.roguda.co.za/course/view.php?id=2',
    'ai-design-tools': 'https://moodle.roguda.co.za/course/view.php?id=3',
    'textile-technology': 'https://moodle.roguda.co.za/course/view.php?id=4'
};
```

#### Update Admin Dashboard (`admin/dashboard.php`):
Find the iframe and update URL:
```javascript
<iframe 
    id="moodleAdminFrame"
    src="https://moodle.roguda.co.za/admin" 
    ...
></iframe>
```

---

## 🔗 Database Schema Updates

Add Moodle user ID field to applicants table:

```sql
ALTER TABLE applicants 
ADD COLUMN moodle_user_id INT DEFAULT NULL,
ADD INDEX idx_moodle_user_id (moodle_user_id);
```

---

## 🎓 User Workflow

### For Students:
1. Register on Roguda website
2. Admin creates corresponding Moodle account
3. Admin links Moodle user ID to Roguda account
4. Student logs into Roguda dashboard
5. Access Moodle courses through embedded portal
6. View real-time stats and progress

### For Admins:
1. Log into admin dashboard
2. View system-wide Moodle statistics
3. Manage courses through embedded admin panel
4. Create assignments and grade submissions
5. Monitor student progress and engagement
6. Generate reports and analytics

---

## 📊 API Endpoints

### Student Endpoints:
- **GET** `/api/moodle-stats.php` - Fetch student's Moodle stats
  - Returns: courses, completed assignments, pending tasks, average grade

### Admin Endpoints:
- **GET** `/api/moodle-admin-stats.php` - Fetch system-wide statistics
  - Returns: total students, courses, pending submissions, average grade

---

## 🔐 Security Best Practices

1. **Secure Tokens**: Store API tokens in environment variables, not hardcoded
2. **HTTPS Only**: Always use SSL/TLS for Moodle connections
3. **Session Management**: Implement proper session timeout and validation
4. **CORS Configuration**: Restrict API access to authorized domains
5. **Rate Limiting**: Implement API rate limiting to prevent abuse
6. **User Permissions**: Ensure proper role-based access control
7. **Audit Logging**: Log all Moodle API calls for security monitoring

---

## 🎨 Customization Options

### Iframe Styling:
Modify height, borders, and layout in dashboard files:
```css
#moodleContainer {
    height: 800px; /* Adjust height */
    border-radius: 12px;
    overflow: hidden;
}
```

### Quick Course Access:
Add more courses in `dashboard.html`:
```html
<a href="#" onclick="openMoodleCourse('new-course-id')">
    <span>🎨</span>
    <div>
        <div>New Course Name</div>
        <div>Module X • Status</div>
    </div>
</a>
```

---

## 🐛 Troubleshooting

### Issue: "Moodle integration pending" message
**Solution**: Configure API tokens in `moodle-stats.php` and `moodle-admin-stats.php`

### Issue: Iframe shows blank page
**Solution**: 
- Check Moodle URL is correct
- Verify Moodle allows iframe embedding
- Check CORS settings in Moodle

### Issue: API returns mock data
**Solution**: 
- Verify web services are enabled in Moodle
- Check API token is valid
- Ensure service functions are added
- Test API endpoint directly in browser

### Issue: "Unauthorized" error
**Solution**: 
- Check user session is active
- Verify admin authentication for admin endpoints
- Ensure database connection is working

---

## 📈 Future Enhancements

- [ ] Single Sign-On (SSO) integration
- [ ] Two-way grade sync automation
- [ ] Push notifications for new assignments
- [ ] Mobile app integration
- [ ] Calendar sync with Moodle events
- [ ] Bulk user creation from CSV
- [ ] Custom Moodle theme matching Roguda branding
- [ ] Direct file upload to Moodle from dashboard

---

## 📞 Support

For technical support with Moodle integration:
- **Email**: support@roguda.co.za
- **Moodle Docs**: https://docs.moodle.org/
- **Roguda IT Team**: Available Mon-Fri, 8AM-5PM SAST

---

## 📝 Notes

- Mock data is shown until Moodle is fully configured
- Replace all placeholder URLs with actual Moodle installation
- Test thoroughly in staging environment before production
- Keep Moodle updated for security patches
- Monitor API usage and performance

---

**Last Updated**: December 3, 2025
**Version**: 1.0
**Integration Status**: ✅ Ready for Configuration
