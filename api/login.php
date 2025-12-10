<?php
// ======================================
// LOGIN API - login.php
// User Authentication Endpoint
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

$email = isset($input['email']) ? trim($input['email']) : '';
$password = isset($input['password']) ? $input['password'] : '';

// Validation
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Valid email is required']);
    exit;
}

if (empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password is required']);
    exit;
}

// Load users
$usersFile = '../data/users.json';

if (!file_exists($usersFile)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'User database not found']);
    exit;
}

$usersData = file_get_contents($usersFile);
$usersJson = json_decode($usersData, true);
$users = isset($usersJson['users']) ? $usersJson['users'] : [];

// Find user
$foundUser = null;
foreach ($users as $index => $user) {
    if ($user['email'] === $email) {
        $foundUser = $user;
        $userIndex = $index;
        break;
    }
}

if (!$foundUser) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    exit;
}

// Verify password
if (!password_verify($password, $foundUser['password'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid email or password']);
    exit;
}

// Update last login
$users[$userIndex]['lastLogin'] = date('c');
$usersJson['users'] = $users;
file_put_contents($usersFile, json_encode($usersJson, JSON_PRETTY_PRINT));

// Generate session token (in production, use proper JWT)
$sessionToken = bin2hex(random_bytes(32));

// Return user data (excluding password)
unset($foundUser['password']);

echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'user' => $foundUser,
    'token' => $sessionToken
]);
?>
