# ========================================
# AUTOMATED BACKUP SCRIPT (Windows PowerShell)
# ========================================
# Schedule this script to run daily via Windows Task Scheduler

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "C:\Backups\Roguda"
$websiteDir = "C:\Users\NefefLocal\Documents\roguda website"
$backupName = "roguda_backup_$timestamp"

# Create backup directory if it doesn't exist
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Roguda Backup Script" -ForegroundColor Cyan
Write-Host "Started: $(Get-Date)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Backup Files
Write-Host "`nStep 1: Backing up website files..." -ForegroundColor Yellow
$filesBackup = "$backupDir\$backupName-files.zip"

try {
    Compress-Archive -Path $websiteDir\* -DestinationPath $filesBackup -CompressionLevel Optimal
    Write-Host "✅ Files backup completed: $filesBackup" -ForegroundColor Green
} catch {
    Write-Host "❌ Files backup failed: $_" -ForegroundColor Red
    exit 1
}

# 2. Backup Database (requires mysqldump)
Write-Host "`nStep 2: Backing up database..." -ForegroundColor Yellow
$dbBackup = "$backupDir\$backupName-database.sql"

# Update these with your actual credentials
$dbHost = "localhost"
$dbUser = "YOUR_DB_USERNAME"
$dbPass = "YOUR_DB_PASSWORD"
$dbName = "roguda_db"

# Check if mysqldump exists
$mysqldump = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"

if (Test-Path $mysqldump) {
    try {
        & $mysqldump --host=$dbHost --user=$dbUser --password=$dbPass $dbName --result-file=$dbBackup
        Write-Host "✅ Database backup completed: $dbBackup" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Database backup skipped (mysqldump not configured)" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  mysqldump not found - database backup skipped" -ForegroundColor Yellow
}

# 3. Calculate backup size
$filesSize = (Get-Item $filesBackup).Length / 1MB
Write-Host "`n📦 Backup size: $([math]::Round($filesSize, 2)) MB" -ForegroundColor Cyan

# 4. Clean old backups (keep last 7 days)
Write-Host "`nStep 3: Cleaning old backups..." -ForegroundColor Yellow
$cutoffDate = (Get-Date).AddDays(-7)
Get-ChildItem $backupDir -Filter "roguda_backup_*" | 
    Where-Object { $_.LastWriteTime -lt $cutoffDate } | 
    ForEach-Object {
        Remove-Item $_.FullName -Force
        Write-Host "🗑️  Removed old backup: $($_.Name)" -ForegroundColor Gray
    }

# 5. Create backup log
$logFile = "$backupDir\backup_log.txt"
$logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | Backup completed | Files: $([math]::Round($filesSize, 2)) MB"
Add-Content -Path $logFile -Value $logEntry

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ Backup completed successfully!" -ForegroundColor Green
Write-Host "Location: $backupDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Optional: Upload to cloud storage (Dropbox, Google Drive, OneDrive, etc.)
# Uncomment and configure as needed:
# Copy-Item $filesBackup -Destination "D:\OneDrive\Backups\Roguda\" -Force
