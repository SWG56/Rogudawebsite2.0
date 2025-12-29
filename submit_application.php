<?php
// ================================
// Roguda - Application Submission
// - Works on standard PHP hosting (Afrihost)
// - Emails the admin + saves CSV backup
// - Supports file uploads (pdf/jpg/jpeg/png)
// ================================
header('X-Content-Type-Options: nosniff');

// Optional WhatsApp notification
@require_once __DIR__ . '/includes/whatsapp.php';

function wants_json() {
  $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
  $xhr = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
  return (stripos($accept, 'application/json') !== false) || (strtolower($xhr) === 'xmlhttprequest');
}

function respond($ok, $message, $extra = []) {
  $payload = array_merge(['success' => $ok, 'message' => $message], $extra);

  if (wants_json()) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
    exit;
  }

  header('Location: ' . ($ok ? 'apply-success.html' : 'apply-failed.html'));
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respond(false, 'Invalid request method.');
}

function clean($v) {
  $v = trim((string)$v);
  $v = str_replace(["\r","\n"], ' ', $v);
  return $v;
}

$data = [
  'firstName' => clean($_POST['firstName'] ?? ''),
  'lastName' => clean($_POST['lastName'] ?? ''),
  'email' => clean($_POST['email'] ?? ''),
  'phone' => clean($_POST['phone'] ?? ''),
  'dob' => clean($_POST['dob'] ?? ''),
  'gender' => clean($_POST['gender'] ?? ''),
  'idNumber' => clean($_POST['idNumber'] ?? ''),
  'address' => clean($_POST['address'] ?? ''),
  'school' => clean($_POST['school'] ?? ''),
  'education' => clean($_POST['education'] ?? ''),
  'graduationYear' => clean($_POST['graduationYear'] ?? ''),
  'program' => clean($_POST['program'] ?? ''),
  'startDate' => clean($_POST['startDate'] ?? ''),
  'motivation' => clean($_POST['motivation'] ?? ''),
  'popiaConsent' => isset($_POST['popiaConsent']) ? 'Yes' : 'No',
  'marketingConsent' => isset($_POST['marketingConsent']) ? 'Yes' : 'No',
  'accuracyConsent' => isset($_POST['accuracyConsent']) ? 'Yes' : 'No',
];

if (!$data['firstName'] || !$data['lastName']) {
  respond(false, 'Please enter your full name.');
}
if (!$data['email'] || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
  respond(false, 'Please enter a valid email address.');
}
if (!$data['phone']) {
  respond(false, 'Please enter your phone number.');
}
if ($data['popiaConsent'] !== 'Yes' || $data['accuracyConsent'] !== 'Yes') {
  respond(false, 'Please accept the required consent checkboxes.');
}

// ---- File Uploads ----
$upload_dir = __DIR__ . '/uploads/applications';
if (!is_dir($upload_dir)) { @mkdir($upload_dir, 0755, true); }

function handle_upload($key, $upload_dir) {
  if (!isset($_FILES[$key]) || $_FILES[$key]['error'] === UPLOAD_ERR_NO_FILE) {
    return ['ok' => true, 'path' => ''];
  }

  if ($_FILES[$key]['error'] !== UPLOAD_ERR_OK) {
    return ['ok' => false, 'error' => 'Upload failed for ' . $key];
  }

  $tmp = $_FILES[$key]['tmp_name'];
  $name = $_FILES[$key]['name'];
  $size = (int)($_FILES[$key]['size'] ?? 0);

  $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
  $allowed = ['pdf','jpg','jpeg','png'];
  if (!in_array($ext, $allowed, true)) {
    return ['ok' => false, 'error' => 'Invalid file type for ' . $key];
  }

  // 8MB limit
  if ($size > 8 * 1024 * 1024) {
    return ['ok' => false, 'error' => 'File too large for ' . $key . ' (max 8MB)'];
  }

  $safe = preg_replace('/[^a-zA-Z0-9._-]/', '_', $name);
  $new_name = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $safe;
  $dest = $upload_dir . '/' . $new_name;

  if (!move_uploaded_file($tmp, $dest)) {
    return ['ok' => false, 'error' => 'Could not save uploaded file for ' . $key];
  }

  return ['ok' => true, 'path' => 'uploads/applications/' . $new_name];
}

$uploads = [];
foreach (['idCopy','certificate','portfolioFile'] as $k) {
  $r = handle_upload($k, $upload_dir);
  if (!$r['ok']) {
    respond(false, $r['error']);
  }
  $uploads[$k] = $r['path'];
}

// ---- Save CSV backup ----
$data_dir = __DIR__ . '/data';
if (!is_dir($data_dir)) { @mkdir($data_dir, 0755, true); }

$csv = $data_dir . '/applications.csv';
$new = !file_exists($csv);
$fp = @fopen($csv, 'a');
if ($fp) {
  if ($new) {
    fputcsv($fp, array_merge(['timestamp'], array_keys($data), array_keys($uploads)));
  }
  fputcsv($fp, array_merge([date('c')], array_values($data), array_values($uploads)));
  fclose($fp);
}

// ---- Email admin ----
$to = "info@rogudafashion.co.za";           // change if you want another inbox
$subject = "New Application - Roguda Fashion";
$from = "info@rogudafashion.co.za";     // sender mailbox on your domain

$headers = "From: {$from}\r\n";
$headers .= "Reply-To: {$data['email']}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

$body = "New student application received:\n\n";
foreach ($data as $k => $v) {
  $body .= ucfirst($k) . ": " . $v . "\n";
}
$body .= "\nUploads (saved on server):\n";
foreach ($uploads as $k => $p) {
  $body .= $k . ": " . ($p ?: 'N/A') . "\n";
}
$body .= "\nSubmitted from: " . ($_SERVER['HTTP_REFERER'] ?? '') . "\n";

@mail($to, $subject, $body, $headers);


// ---- Optional WhatsApp notify (short message) ----
$wa_msg = "Roguda: New application\n"
        . "Name: {$data['firstName']} {$data['lastName']}\n"
        . "Program: {$data['program']}\n"
        . "Phone: {$data['phone']}\n"
        . "Email: {$data['email']}";
@roguda_send_whatsapp_text($wa_msg);

respond(true, 'Application submitted successfully.');
