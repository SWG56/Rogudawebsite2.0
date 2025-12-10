<?php
// ================================
// ROGUDA FASHION & ART DESIGN SCHOOL
// Secure Application Processor
// ================================

// === CONFIGURATION ===
$admin_email = "applications@roguda.co.za"; // 👈🏽 Change to your real admin email
$from_email  = "no-reply@roguda.co.za";     // 👈🏽 Must exist in your Afrihost domain
$subject     = "New Application – Roguda Fashion & Art Design";

// === SANITIZE FUNCTION ===
function clean_input($data) {
  return htmlspecialchars(strip_tags(trim($data)));
}

// === CAPTURE FORM INPUTS ===
$fields = [
  'firstName', 'lastName', 'email', 'phone', 'idNumber', 'dob',
  'gender', 'address', 'program', 'startDate', 'motivation',
  'education', 'school', 'graduationYear', 'portfolio', 'experience',
  'popiaConsent', 'marketingConsent', 'accuracyConsent'
];

foreach ($fields as $field) {
  $$field = isset($_POST[$field]) ? clean_input($_POST[$field]) : '';
}

// === HANDLE FILE UPLOADS ===
$upload_dir = __DIR__ . "/uploads";
if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

$uploaded_files = [];

function handle_file_upload($file_key, $upload_dir) {
  if (isset($_FILES[$file_key]) && $_FILES[$file_key]['error'] === UPLOAD_ERR_OK) {
    $file_name = $_FILES[$file_key]['name'];
    $file_tmp = $_FILES[$file_key]['tmp_name'];
    $file_size = $_FILES[$file_key]['size'];
    $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
    
    // Validate file type and size
    $allowed_extensions = ['pdf', 'jpg', 'jpeg', 'png'];
    if (!in_array($file_ext, $allowed_extensions)) {
      return "Invalid file type";
    }
    if ($file_size > 5242880) { // 5MB max
      return "File too large";
    }
    
    // Generate unique filename
    $new_file_name = uniqid() . '_' . time() . '.' . $file_ext;
    $destination = $upload_dir . '/' . $new_file_name;
    
    if (move_uploaded_file($file_tmp, $destination)) {
      return $new_file_name;
    }
  }
  return '';
}

$idCopyFile = handle_file_upload('idCopy', $upload_dir);
$certificateFile = handle_file_upload('certificate', $upload_dir);
$portfolioUpload = handle_file_upload('portfolioFile', $upload_dir);

// === BASIC VALIDATION ===
if (empty($firstName) || empty($lastName) || empty($email) || empty($program)) {
  die("⚠️ Required fields are missing. Please go back and complete all fields marked with *.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  die("⚠️ Invalid email format. Please enter a valid email address.");
}

// === LOG APPLICATION LOCALLY ===
$log_dir = __DIR__ . "/logs";
if (!is_dir($log_dir)) mkdir($log_dir, 0755, true);

$log_file = $log_dir . "/applications_" . date('Y-m') . ".csv";
$new_entry = [
  date("Y-m-d H:i:s"),
  $firstName,
  $lastName,
  $email,
  $phone,
  $idNumber,
  $dob,
  $gender,
  $address,
  $program,
  $startDate,
  $motivation,
  $education,
  $school,
  $graduationYear,
  $portfolio,
  $experience,
  $idCopyFile,
  $certificateFile,
  $portfolioUpload,
  $popiaConsent ? 'Yes' : 'No',
  $marketingConsent ? 'Yes' : 'No',
  $accuracyConsent ? 'Yes' : 'No'
];

$fp = fopen($log_file, "a");
fputcsv($fp, $new_entry);
fclose($fp);

// === COMPOSE EMAIL ===
$message = "
<html>
<head><title>New Application – Roguda</title></head>
<body style='font-family:Arial,sans-serif;color:#333;background:#f5f5f5;padding:2rem;'>
  <div style='max-width:700px;margin:0 auto;background:#fff;padding:2rem;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,0.1);'>
    <h2 style='color:#C79E4F;border-bottom:3px solid #C79E4F;padding-bottom:1rem;'>🎓 New Student Application Received</h2>
    
    <h3 style='color:#C79E4F;margin-top:1.5rem;'>Personal Information</h3>
    <p><strong>Name:</strong> {$firstName} {$lastName}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Phone:</strong> {$phone}</p>
    <p><strong>ID / Passport:</strong> {$idNumber}</p>
    <p><strong>Date of Birth:</strong> {$dob}</p>
    <p><strong>Gender:</strong> {$gender}</p>
    <p><strong>Address:</strong> {$address}</p>
    
    <h3 style='color:#C79E4F;margin-top:1.5rem;'>Program Selection</h3>
    <p><strong>Selected Program:</strong> {$program}</p>
    <p><strong>Preferred Start Date:</strong> {$startDate}</p>
    <p><strong>Motivation:</strong><br>{$motivation}</p>
    
    <h3 style='color:#C79E4F;margin-top:1.5rem;'>Educational Background</h3>
    <p><strong>Highest Education:</strong> {$education}</p>
    <p><strong>School / Institution:</strong> {$school}</p>
    <p><strong>Year Completed/Expected:</strong> {$graduationYear}</p>
    <p><strong>Portfolio Link:</strong> " . ($portfolio ? $portfolio : 'Not provided') . "</p>
    <p><strong>Previous Experience:</strong><br>" . ($experience ? $experience : 'Not provided') . "</p>
    
    <h3 style='color:#C79E4F;margin-top:1.5rem;'>Uploaded Documents</h3>
    <p><strong>ID Copy:</strong> " . ($idCopyFile ? "✅ {$idCopyFile}" : "Not uploaded") . "</p>
    <p><strong>Certificate:</strong> " . ($certificateFile ? "✅ {$certificateFile}" : "Not uploaded") . "</p>
    <p><strong>Portfolio File:</strong> " . ($portfolioUpload ? "✅ {$portfolioUpload}" : "Not uploaded") . "</p>
    
    <h3 style='color:#C79E4F;margin-top:1.5rem;'>Consent & Compliance</h3>
    <p><strong>POPIA Consent:</strong> " . ($popiaConsent ? '✅ Yes' : '❌ No') . "</p>
    <p><strong>Marketing Consent:</strong> " . ($marketingConsent ? '✅ Yes' : '❌ No') . "</p>
    <p><strong>Accuracy Confirmation:</strong> " . ($accuracyConsent ? '✅ Yes' : '❌ No') . "</p>
    
    <hr style='margin:2rem 0;border:none;border-top:1px solid #ddd;'>
    <p style='color:#888;font-size:0.9rem;'>This record was securely logged under POPIA compliance on " . date("d M Y, H:i") . ".</p>
  </div>
</body>
</html>
";

// === EMAIL HEADERS ===
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";
$headers .= "From: Roguda Applications <{$from_email}>\r\n";
$headers .= "Reply-To: {$email}\r\n";

// === SEND MAIL ===
if (mail($admin_email, $subject, $message, $headers)) {
  echo "<html><body style='background:#121212;color:#fff;font-family:Outfit,Arial;text-align:center;padding:4rem;'>
          <h1 style='color:#C79E4F;'>✅ Application Submitted</h1>
          <p>Thank you, <strong>{$firstName}</strong>! Your application has been successfully received.</p>
          <p>We will review it and contact you via email within 5–7 business days.</p>
          <a href='index.html' style='display:inline-block;margin-top:2rem;padding:1rem 2rem;background:#C79E4F;color:#000;text-decoration:none;border-radius:8px;font-weight:700;'>Return Home</a>
        </body></html>";
} else {
  echo "<html><body style='background:#121212;color:#fff;font-family:Outfit,Arial;text-align:center;padding:4rem;'>
          <h2 style='color:#E57373;'>⚠️ Oops! Something went wrong.</h2>
          <p>Your application could not be sent. Please try again later or contact <a href='mailto:{$admin_email}' style='color:#F8D548;'>support</a>.</p>
        </body></html>";
}
?>
