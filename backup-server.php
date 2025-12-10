#!/usr/bin/env php
<?php
// ========================================
// AUTOMATED BACKUP SCRIPT FOR AFRIHOST
// ========================================
// Schedule this via cPanel Cron Jobs
// Cron: 0 2 * * * /usr/bin/php /home/username/public_html/backup-server.php

$timestamp = date('Ymd_His');
$backupDir = __DIR__ . '/backups';
$websiteDir = __DIR__;

// Create backup directory if it doesn't exist
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

echo "========================================\n";
echo "Roguda Server Backup Script\n";
echo "Started: " . date('Y-m-d H:i:s') . "\n";
echo "========================================\n\n";

// 1. Database Backup
echo "Step 1: Backing up database...\n";

require_once 'includes/config.php';

$dbBackupFile = "$backupDir/database_$timestamp.sql";
$command = sprintf(
    'mysqldump --host=%s --user=%s --password=%s %s > %s',
    escapeshellarg(DB_HOST),
    escapeshellarg(DB_USER),
    escapeshellarg(DB_PASS),
    escapeshellarg(DB_NAME),
    escapeshellarg($dbBackupFile)
);

exec($command, $output, $returnCode);

if ($returnCode === 0) {
    echo "✅ Database backup completed: $dbBackupFile\n";
    $dbSize = filesize($dbBackupFile) / 1024;
    echo "   Size: " . round($dbSize, 2) . " KB\n";
} else {
    echo "❌ Database backup failed!\n";
}

// 2. Files Backup
echo "\nStep 2: Backing up important files...\n";

$filesToBackup = [
    'includes/config.php',
    'SQL_SETUP.sql',
    '.htaccess'
];

$filesBackupDir = "$backupDir/files_$timestamp";
mkdir($filesBackupDir, 0755, true);

foreach ($filesToBackup as $file) {
    if (file_exists($file)) {
        $destDir = dirname("$filesBackupDir/$file");
        if (!is_dir($destDir)) {
            mkdir($destDir, 0755, true);
        }
        copy($file, "$filesBackupDir/$file");
        echo "✅ Backed up: $file\n";
    }
}

// Create ZIP archive
$zipFile = "$backupDir/files_$timestamp.zip";
$zip = new ZipArchive();

if ($zip->open($zipFile, ZipArchive::CREATE) === TRUE) {
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($filesBackupDir),
        RecursiveIteratorIterator::LEAVES_ONLY
    );
    
    foreach ($files as $file) {
        if (!$file->isDir()) {
            $filePath = $file->getRealPath();
            $relativePath = substr($filePath, strlen($filesBackupDir) + 1);
            $zip->addFile($filePath, $relativePath);
        }
    }
    
    $zip->close();
    echo "✅ Files archive created: $zipFile\n";
    
    // Remove temp directory
    system("rm -rf " . escapeshellarg($filesBackupDir));
}

// 3. Clean old backups (keep last 7 days)
echo "\nStep 3: Cleaning old backups...\n";
$cutoffTime = time() - (7 * 24 * 60 * 60);

foreach (glob("$backupDir/*") as $file) {
    if (filemtime($file) < $cutoffTime) {
        unlink($file);
        echo "🗑️  Removed old backup: " . basename($file) . "\n";
    }
}

// 4. Log backup
$logFile = "$backupDir/backup_log.txt";
$logEntry = date('Y-m-d H:i:s') . " | Backup completed | Database: " . round($dbSize, 2) . " KB\n";
file_put_contents($logFile, $logEntry, FILE_APPEND);

echo "\n========================================\n";
echo "✅ Backup completed successfully!\n";
echo "Location: $backupDir\n";
echo "========================================\n";

// Optional: Send email notification
$adminEmail = ADMIN_EMAIL;
$subject = "Roguda Backup Completed - " . date('Y-m-d');
$message = "Database backup: " . round($dbSize, 2) . " KB\nTimestamp: $timestamp";
mail($adminEmail, $subject, $message);
?>
