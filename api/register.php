<?php
// ======================================
// REGISTER API - register.php
// User Registration Endpoint
// ======================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Sanitize function
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// Extract fields
$fullName = isset($input['fullName']) ? sanitize($input['fullName']) : '';
$email = isset($input['email']) ? sanitize($input['email']) : '';
$phone = isset($input['phone']) ? sanitize($input['phone']) : '';
$password = isset($input['password']) ? $input['password'] : '';
$userType = isset($input['userType']) ? sanitize($input['userType']) : 'student';
$popiaConsent = isset($input['popiaConsent']) ? (bool)$input['popiaConsent'] : false;

// Validation
$errors = [];

if (empty($fullName) || strlen($fullName) < 3) {
    $errors[] = 'Full name is required (minimum 3 characters)';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}

if (empty($password) || strlen($password) < 6) {
    $errors[] = 'Password must be at least 6 characters';
}

if (!$popiaConsent) {
    $errors[] = 'POPIA consent is required';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// Load existing users
$usersFile = '../data/users.json';
$users = [];

if (file_exists($usersFile)) {
    $usersData = file_get_contents($usersFile);
    $usersJson = json_decode($usersData, true);
    $users = isset($usersJson['users']) ? $usersJson['users'] : [];
}

// Check if email already exists
foreach ($users as $user) {
    if ($user['email'] === $email) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit;
    }
}

// Create new user
$newUser = [
    'id' => count($users) + 1,
    'fullName' => $fullName,
    'email' => $email,
    'phone' => $phone,
    'password' => password_hash($password, PASSWORD_BCRYPT),
    'userType' => $userType,
    'role' => $userType,
    'registeredAt' => date('c'),
    'popiaConsent' => true,
    'status' => 'active',
    'lastLogin' => null
];

$users[] = $newUser;

// Save to file
$usersJson = [
    'users' => $users,
    'notes' => ['Production: Use database with proper security measures']
];

file_put_contents($usersFile, json_encode($usersJson, JSON_PRETTY_PRINT));

// Return success (excluding password)
unset($newUser['password']);

echo json_encode([
    'success' => true,
    'message' => 'Registration successful',
    'user' => $newUser
]);
?>
