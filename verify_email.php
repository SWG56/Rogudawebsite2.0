<?php
declare(strict_types=1);

require_once __DIR__ . '/db_data.php';

function out(string $msg): void {
  echo "<div style='font-family:Arial,sans-serif; padding:24px;'>
          <h2>" . htmlspecialchars($msg) . "</h2>
          <p><a href='index.html'>Return to Home</a></p>
        </div>";
  exit;
}

$token = trim((string)($_GET['token'] ?? ''));
if ($token === '' || strlen($token) < 20) out('Invalid verification token.');

$tokenHash = hash('sha256', $token);

try {
  $pdo->beginTransaction();

  $stmt = $pdo->prepare("
    SELECT verification_id, applicant_id, expires_at, used_at
    FROM email_verifications
    WHERE token_hash = :th
    LIMIT 1
  ");
  $stmt->execute([':th' => $tokenHash]);
  $row = $stmt->fetch();

  if (!$row) { $pdo->rollBack(); out('Verification link is invalid or already used.'); }
  if (!empty($row['used_at'])) { $pdo->rollBack(); out('This verification link has already been used.'); }
  if (strtotime((string)$row['expires_at']) < time()) { $pdo->rollBack(); out('This verification link has expired.'); }

  $stmt = $pdo->prepare("UPDATE email_verifications SET used_at = NOW() WHERE verification_id = :vid");
  $stmt->execute([':vid' => $row['verification_id']]);

  $stmt = $pdo->prepare("UPDATE applicants SET email_verified = 1, email_verified_at = NOW() WHERE applicant_id = :aid");
  $stmt->execute([':aid' => $row['applicant_id']]);

  $pdo->commit();
  out('Email Verified ✅ Your application is confirmed.');

} catch (Throwable $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  out('Verification failed. Please contact admissions.');
}
