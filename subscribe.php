<?php
// ================================
// Roguda - Newsletter Subscribe
// Works with normal form POST and AJAX fetch()
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

  // Fallback for normal form submit
  $dest = $ok ? 'subscribe-success.html' : 'subscribe-failed.html';
  header('Location: ' . $dest);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  respond(false, 'Invalid request method.');
}

$email = trim($_POST['email'] ?? '');
if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  respond(false, 'Please enter a valid email address.');
}

// Save subscriber (CSV)
$dir = __DIR__ . '/data';
if (!is_dir($dir)) { @mkdir($dir, 0755, true); }

$file = $dir . '/subscribers.csv';
$exists = file_exists($file);

$fp = @fopen($file, 'a');
if (!$fp) {
  respond(false, 'Could not save your subscription. Please try again later.');
}

if (!$exists) {
  fputcsv($fp, ['timestamp', 'email', 'page']);
}
$page = trim($_POST['page'] ?? ($_SERVER['HTTP_REFERER'] ?? ''));
fputcsv($fp, [date('c'), $email, $page]);
fclose($fp);

// Optional: notify admin (safe default = off)
// Uncomment if you want an email notification each time.
// $to = "info@rogudafashion.co.za";
// $subject = "New Newsletter Subscriber - Roguda";
// $headers = "From: no-reply@rogudafashion.co.za\r\nReply-To: ".$email."\r\n";
// @mail($to, $subject, "New subscriber: ".$email."\nPage: ".$page, $headers);


// ---- Optional WhatsApp notify ----
$wa_msg = "Roguda: New newsletter subscriber\nEmail: {$email}";
@roguda_send_whatsapp_text($wa_msg);

respond(true, 'Subscribed successfully.');
