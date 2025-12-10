# 🚀 GitHub Upload Guide - Roguda Website

## ✅ What We've Done So Far

1. ✅ Initialized Git repository
2. ✅ Created `.gitignore` to exclude sensitive files
3. ✅ Created `includes/config.sample.php` (safe for GitHub)
4. ✅ Added all files to Git
5. ✅ Created initial commit with 77 files

---

## 📋 Next Steps to Push to GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `roguda-website` (or your preferred name)
   - **Description**: "Roguda Fashion & Art Design School - Modern cinematic website with Moodle LMS integration"
   - **Visibility**: 
     - ✅ **Public** (if you want it open source)
     - 🔒 **Private** (if you want to keep it private)
   - ⚠️ **DO NOT** check "Add README" (we already have one)
   - ⚠️ **DO NOT** add .gitignore or license (we already have .gitignore)
4. Click **"Create repository"**

### Step 2: Connect Local Repository to GitHub

GitHub will show you commands. Copy the URL and run these commands:

**Option A: If you chose HTTPS**
```powershell
cd "C:\Users\NefefLocal\Documents\roguda website"
git remote add origin https://github.com/YOUR_USERNAME/roguda-website.git
git branch -M main
git push -u origin main
```

**Option B: If you chose SSH** (more secure)
```powershell
cd "C:\Users\NefefLocal\Documents\roguda website"
git remote add origin git@github.com:YOUR_USERNAME/roguda-website.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username!

### Step 3: Authenticate

**For HTTPS:**
- GitHub will prompt for username and password
- **Important**: Use a **Personal Access Token** instead of password
- Create token at: https://github.com/settings/tokens
- Select scopes: `repo` (full control of private repositories)

**For SSH:**
- Generate SSH key if you don't have one:
```powershell
ssh-keygen -t ed25519 -C "your_email@example.com"
```
- Add key to GitHub: Settings → SSH and GPG keys → New SSH key
- Copy key content:
```powershell
cat ~/.ssh/id_ed25519.pub
```

### Step 4: Verify Upload

After pushing, visit your GitHub repository:
```
https://github.com/YOUR_USERNAME/roguda-website
```

You should see all 77 files uploaded! 🎉

---

## 📁 What's Included in the Upload

### ✅ Included (Safe for GitHub)
- ✅ All HTML, CSS, JavaScript files
- ✅ Documentation (.md files)
- ✅ Sample config file (`config.sample.php`)
- ✅ Images and assets
- ✅ SQL schema file
- ✅ .gitignore file
- ✅ Legal documents (POPIA, privacy policy)

### ❌ Excluded (Sensitive - Protected by .gitignore)
- ❌ `includes/config.php` (actual database credentials)
- ❌ `includes/database.php` (if it contains credentials)
- ❌ `.env` files
- ❌ Backup files with data (*.sql backups)
- ❌ User uploads directory
- ❌ Session files
- ❌ Logs

---

## 🔄 Future Updates - How to Push Changes

After making changes to your code:

```powershell
cd "C:\Users\NefefLocal\Documents\roguda website"

# See what changed
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "Description of what you changed"

# Push to GitHub
git push origin main
```

### Example Workflow:
```powershell
# After editing index.html and dashboard.html
git add index.html dashboard.html
git commit -m "Update homepage hero section and dashboard layout"
git push origin main
```

---

## 🌿 Working with Branches (Recommended)

Create feature branches for major changes:

```powershell
# Create new branch for a feature
git checkout -b feature/moodle-improvements

# Make changes, then commit
git add .
git commit -m "Enhance Moodle integration with SSO"

# Push branch to GitHub
git push origin feature/moodle-improvements

# On GitHub, create Pull Request to merge into main
```

---

## 📝 Best Practices

### Commit Messages
Use clear, descriptive messages:
- ✅ "Add Moodle LMS integration to student dashboard"
- ✅ "Fix responsive design on mobile devices"
- ✅ "Update analytics API to include monthly trends"
- ❌ "update"
- ❌ "fix stuff"
- ❌ "changes"

### When to Commit
- After completing a feature
- After fixing a bug
- Before switching tasks
- At the end of each work session

### Never Commit
- Passwords or API keys
- Database files with user data
- Large binary files (use Git LFS if needed)
- Node_modules or vendor folders
- Personal configuration files

---

## 🔒 Security Checklist Before Pushing

- [ ] Verified `includes/config.php` is in `.gitignore`
- [ ] No passwords in any committed file
- [ ] No API keys or tokens in code
- [ ] `config.sample.php` has placeholder values only
- [ ] No database dumps with real data
- [ ] `.env` files are gitignored

---

## 🆘 Common Issues & Solutions

### Issue 1: "Permission denied (publickey)"
**Solution**: Add SSH key to GitHub or use HTTPS with token

### Issue 2: "Failed to push some refs"
**Solution**: Pull first, then push
```powershell
git pull origin main --rebase
git push origin main
```

### Issue 3: "Large file detected"
**Solution**: Remove large files from commit
```powershell
git rm --cached path/to/large/file
git commit --amend
```

### Issue 4: Accidentally committed sensitive file
**Solution**: Remove from history (before pushing!)
```powershell
git rm --cached includes/config.php
git commit --amend
```

---

## 🔗 Useful Git Commands

```powershell
# Check status
git status

# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename.html

# View differences
git diff

# Create .gitignore after adding files
git rm -r --cached .
git add .
git commit -m "Apply .gitignore"
```

---

## 📚 Additional Resources

- GitHub Docs: https://docs.github.com/
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf
- Git Visual Guide: https://marklodato.github.io/visual-git-guide/index-en.html

---

## ✅ Quick Checklist

- [ ] Created GitHub repository
- [ ] Ran `git remote add origin <URL>`
- [ ] Ran `git branch -M main`
- [ ] Ran `git push -u origin main`
- [ ] Verified all files uploaded on GitHub
- [ ] Checked no sensitive data committed
- [ ] Added repository description on GitHub
- [ ] Set up branch protection rules (optional)
- [ ] Invited collaborators (if any)

---

## 🎉 Success!

Your Roguda website is now on GitHub with:
- ✅ Complete source code
- ✅ All documentation files
- ✅ Moodle integration guides
- ✅ Deployment checklists
- ✅ Professional README

**Next Steps:**
1. Add GitHub Actions for CI/CD (optional)
2. Set up GitHub Pages for documentation
3. Enable Dependabot for security updates
4. Create project board for task tracking

---

**Need Help?** Open an issue on GitHub or contact the development team!
