<?php
declare(strict_types=1);

require_once __DIR__ . '/db_data.php';

header('X-Content-Type-Options: nosniff');

// ===== CONFIG =====
$BASE_URL = 'https://rogudafashion.co.za';
$VERIFY_TTL_MINUTES = 45;

$FROM_EMAIL = 'info@rogudafashion.co.za';
$FROM_NAME  = 'Roguda Admissions';

$MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
$ALLOWED_EXT  = ['pdf', 'jpg', 'jpeg', 'png'];
$ALLOWED_MIME = ['application/pdf', 'image/jpeg', 'image/png'];

// Your real folder: public_html/uploads/applications
$UPLOAD_BASE = __DIR__ . '/uploads/applications';

// ===== HELPERS =====
function fail_redirect(): void {
  header('Location: apply-failed.html');
  exit;
}

function clean(?string $v, int $maxLen = 255): string {
  $v = trim((string)$v);
  $v = preg_replace('/\s+/', ' ', $v);
  if (mb_strlen($v) > $maxLen) $v = mb_substr($v, 0, $maxLen);
  return $v;
}

function valid_phone(string $phone): bool {
  $p = preg_replace('/\s+/', '', $phone);
  return (bool)preg_match('/^(\+27|0)[0-9]{9}$/', $p);
}

function safe_mkdir(string $dir): void {
  if (!is_dir($dir)) {
    if (!mkdir($dir, 0755, true)) {
      throw new RuntimeException("Could not create directory: {$dir}");
    }
  }
}

function validate_upload(array $file, array $allowedExt, array $allowedMime, int $maxBytes): string {
  if (!isset($file['error']) || is_array($file['error'])) throw new RuntimeException('Invalid upload.');
  if ($file['error'] !== UPLOAD_ERR_OK) throw new RuntimeException('Upload failed.');
  if (($file['size'] ?? 0) <= 0 || ($file['size'] ?? 0) > $maxBytes) throw new RuntimeException('File too large.');

  $ext = strtolower(pathinfo((string)$file['name'], PATHINFO_EXTENSION));
  if (!in_array($ext, $allowedExt, true)) throw new RuntimeException('Invalid file type.');

  $finfo = new finfo(FILEINFO_MIME_TYPE);
  $mime = $finfo->file($file['tmp_name']) ?: '';
  if (!in_array($mime, $allowedMime, true)) throw new RuntimeException('Invalid file content type.');

  return $ext;
}

function random_token(int $bytes = 32): string {
  return bin2hex(random_bytes($bytes));
}

function send_email(string $to, string $subject, string $html, string $fromEmail, string $fromName): bool {
  $headers = [];
  $headers[] = "MIME-Version: 1.0";
  $headers[] = "Content-type: text/html; charset=UTF-8";
  $headers[] = "From: " . mb_encode_mimeheader($fromName) . " <{$fromEmail}>";
  $headers[] = "Reply-To: {$fromEmail}";
  return @mail($to, $subject, $html, implode("\r\n", $headers));
}

// ===== MAIN =====
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail_redirect();

// From apply.html
$firstName = clean($_POST['firstName'] ?? '', 100);
$lastName  = clean($_POST['lastName'] ?? '', 100);
$email     = clean($_POST['email'] ?? '', 255);
$phone     = clean($_POST['phone'] ?? '', 30);
$idNumber  = clean($_POST['idNumber'] ?? '', 50);
$dob       = clean($_POST['dob'] ?? '', 20);
$gender    = clean($_POST['gender'] ?? '', 20);
$address   = clean($_POST['address'] ?? '', 1000);

$program    = clean($_POST['program'] ?? '', 200);
$startYear  = clean($_POST['startDate'] ?? '', 10); // your form uses startDate but it's a year
$motivation = clean($_POST['motivation'] ?? '', 2000);

$education = clean($_POST['education'] ?? '', 100);
$school    = clean($_POST['school'] ?? '', 200);
$graduationYear = clean($_POST['graduationYear'] ?? '', 10);
$portfolioLink  = clean($_POST['portfolio'] ?? '', 500);
$experience     = clean($_POST['experience'] ?? '', 2000);

$popiaConsent     = isset($_POST['popiaConsent']) ? 1 : 0;
$marketingConsent = isset($_POST['marketingConsent']) ? 1 : 0;
$accuracyConsent  = isset($_POST['accuracyConsent']) ? 1 : 0;

// ---- Validations ----
if ($firstName===''||$lastName===''||$email===''||$phone===''||$idNumber===''||$dob===''||$address==='') fail_redirect();
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail_redirect();
if (!valid_phone($phone)) fail_redirect();

// Basic SA ID length check (optional but helpful)
if (preg_match('/^\d+$/', $idNumber) && strlen($idNumber) !== 13) {
  fail_redirect();
}

$dobTime = strtotime($dob);
if ($dobTime === false || $dobTime > time()) fail_redirect();

if ($program===''||$startYear===''||$motivation==='') fail_redirect();
if (!preg_match('/^(2026|2027|2028|2029|2030)$/', $startYear)) fail_redirect();

if ($education===''||$school===''||$graduationYear==='') fail_redirect();
if (!preg_match('/^(19|20)\d{2}$/', $graduationYear)) fail_redirect();

if ($portfolioLink!=='' && !filter_var($portfolioLink, FILTER_VALIDATE_URL)) fail_redirect();
if ($popiaConsent!==1 || $accuracyConsent!==1) fail_redirect();

// Required file
if (!isset($_FILES['idCopy']) || ($_FILES['idCopy']['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) fail_redirect();

try {
  // Ensure base upload folder exists
  safe_mkdir($UPLOAD_BASE);

  // Validate uploads (content & size)
  validate_upload($_FILES['idCopy'], $ALLOWED_EXT, $ALLOWED_MIME, $MAX_FILE_BYTES);
  if (isset($_FILES['certificate']) && $_FILES['certificate']['error'] !== UPLOAD_ERR_NO_FILE) {
    validate_upload($_FILES['certificate'], $ALLOWED_EXT, $ALLOWED_MIME, $MAX_FILE_BYTES);
  }
  if (isset($_FILES['portfolioFile']) && $_FILES['portfolioFile']['error'] !== UPLOAD_ERR_NO_FILE) {
    validate_upload($_FILES['portfolioFile'], $ALLOWED_EXT, $ALLOWED_MIME, $MAX_FILE_BYTES);
  }

  $pdo->beginTransaction();

  // Applicants
  $stmt = $pdo->prepare("
    INSERT INTO applicants (first_name, last_name, email, phone, id_number, date_of_birth, gender, address)
    VALUES (:fn,:ln,:em,:ph,:idn,:dob,:ge,:ad)
  ");
  $stmt->execute([
    ':fn'=>$firstName, ':ln'=>$lastName, ':em'=>$email, ':ph'=>$phone,
    ':idn'=>$idNumber, ':dob'=>date('Y-m-d',$dobTime), ':ge'=>$gender, ':ad'=>$address
  ]);
  $applicantId = (int)$pdo->lastInsertId();

  // Programs (get or create)
  $programStartDate = $startYear . "-01-01";
  $stmt = $pdo->prepare("SELECT program_id FROM programs WHERE program_name=:pn AND start_date=:sd LIMIT 1");
  $stmt->execute([':pn'=>$program, ':sd'=>$programStartDate]);
  $row = $stmt->fetch();
  if ($row) $programId = (int)$row['program_id'];
  else {
    $stmt = $pdo->prepare("INSERT INTO programs (program_name, start_date) VALUES (:pn,:sd)");
    $stmt->execute([':pn'=>$program, ':sd'=>$programStartDate]);
    $programId = (int)$pdo->lastInsertId();
  }

  // Applications
  $stmt = $pdo->prepare("INSERT INTO applications (applicant_id, program_id, motivation) VALUES (:aid,:pid,:mot)");
  $stmt->execute([':aid'=>$applicantId, ':pid'=>$programId, ':mot'=>$motivation]);

  // Education
  $stmt = $pdo->prepare("
    INSERT INTO education (applicant_id, education_level, institution, graduation_year, previous_experience, portfolio_link)
    VALUES (:aid,:lvl,:inst,:gy,:exp,:plink)
  ");
  $stmt->execute([
    ':aid'=>$applicantId, ':lvl'=>$education, ':inst'=>$school, ':gy'=>$graduationYear,
    ':exp'=>$experience, ':plink'=>$portfolioLink
  ]);

  // Consents
  $stmt = $pdo->prepare("
    INSERT INTO consents (applicant_id, popia_consent, marketing_consent, accuracy_consent)
    VALUES (:aid,:pc,:mc,:ac)
  ");
  $stmt->execute([
    ':aid'=>$applicantId, ':pc'=>$popiaConsent, ':mc'=>$marketingConsent, ':ac'=>$accuracyConsent
  ]);

  // Uploads into: uploads/applications/{applicantId}/
  $appDir = $UPLOAD_BASE . '/' . $applicantId;
  safe_mkdir($appDir);

  $map = ['idCopy'=>'id_copy','certificate'=>'certificate','portfolioFile'=>'portfolio'];
  foreach ($map as $input=>$type) {
    if (!isset($_FILES[$input])) continue;
    $f = $_FILES[$input];
    if ($input!=='idCopy' && $f['error']===UPLOAD_ERR_NO_FILE) continue;

    $ext = validate_upload($f, $ALLOWED_EXT, $ALLOWED_MIME, $MAX_FILE_BYTES);
    $newName = $type . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
    $dest = $appDir . '/' . $newName;

    if (!move_uploaded_file($f['tmp_name'], $dest)) throw new RuntimeException('File save failed.');

    $stmt = $pdo->prepare("INSERT INTO applicant_files (applicant_id, file_type, file_name) VALUES (:aid,:ft,:fn)");
    $stmt->execute([':aid'=>$applicantId, ':ft'=>$type, ':fn'=>$newName]);
  }

  // Email verification
  $rawToken  = random_token(32);
  $tokenHash = hash('sha256', $rawToken);
  $expiresAt = (new DateTimeImmutable('now'))->modify("+{$VERIFY_TTL_MINUTES} minutes")->format('Y-m-d H:i:s');

  $stmt = $pdo->prepare("INSERT INTO email_verifications (applicant_id, token_hash, expires_at) VALUES (:aid,:th,:ex)");
  $stmt->execute([':aid'=>$applicantId, ':th'=>$tokenHash, ':ex'=>$expiresAt]);

  $pdo->commit();

  // Send verification email (don’t fail submission if mail fails)
  $verifyLink = $BASE_URL . "/verify_email.php?token=" . urlencode($rawToken);

  $subject = "Verify your email - Roguda Application Received";
  $html = "
    <div style='font-family:Arial,sans-serif; line-height:1.6;'>
      <h2>Application Received</h2>
      <p>Hi <strong>" . htmlspecialchars($firstName) . "</strong>,</p>
      <p>We received your application for <strong>" . htmlspecialchars($program) . "</strong>.</p>
      <p>Please verify your email within <strong>{$VERIFY_TTL_MINUTES} minutes</strong>:</p>
      <p style='margin:16px 0;'>
        <a href='" . htmlspecialchars($verifyLink) . "' style='background:#C79E4F;color:#000;padding:12px 18px;text-decoration:none;border-radius:8px;font-weight:bold;'>
          Verify Email
        </a>
      </p>
      <p>If the button doesn't work, use this link:</p>
      <p><a href='" . htmlspecialchars($verifyLink) . "'>" . htmlspecialchars($verifyLink) . "</a></p>
      <p>Regards,<br>Roguda Admissions</p>
    </div>
  ";
  send_email($email, $subject, $html, $FROM_EMAIL, $FROM_NAME);

  header('Location: apply-success.html');
  exit;

} catch (Throwable $e) {
  if ($pdo->inTransaction()) $pdo->rollBack();
  error_log("submit_application.php error: " . $e->getMessage());
  fail_redirect();
}
