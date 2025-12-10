<?php
// ======================================
// UPLOAD PROJECT API - upload_project.php
// Student Project Upload Endpoint
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

// Check if user is authenticated (in production, verify JWT token)
$authHeader = isset($_SERVER['HTTP_AUTHORIZATION']) ? $_SERVER['HTTP_AUTHORIZATION'] : '';
if (empty($authHeader)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// Handle file upload
if (!isset($_FILES['project_file']) || $_FILES['project_file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'No file uploaded or upload error']);
    exit;
}

$file = $_FILES['project_file'];
$projectTitle = isset($_POST['title']) ? trim($_POST['title']) : 'Untitled Project';
$projectDescription = isset($_POST['description']) ? trim($_POST['description']) : '';
$studentEmail = isset($_POST['email']) ? trim($_POST['email']) : '';

// Validate file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images and PDFs allowed.']);
    exit;
}

// Validate file size (max 5MB)
$maxSize = 5 * 1024 * 1024;
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'File too large. Maximum size is 5MB.']);
    exit;
}

// Create upload directory if it doesn't exist
$uploadDir = '../uploads/projects/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('project_') . '_' . time() . '.' . $extension;
$filepath = $uploadDir . $filename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save file']);
    exit;
}

// Save project metadata
$projectsFile = '../data/projects.json';
$projects = [];

if (file_exists($projectsFile)) {
    $projectsData = file_get_contents($projectsFile);
    $projectsJson = json_decode($projectsData, true);
    $projects = isset($projectsJson['projects']) ? $projectsJson['projects'] : [];
}

$newProject = [
    'id' => count($projects) + 1,
    'title' => $projectTitle,
    'description' => $projectDescription,
    'designer' => $studentEmail,
    'filename' => $filename,
    'filepath' => $filepath,
    'uploadedAt' => date('c'),
    'status' => 'pending_review',
    'thumbnail' => 'uploads/projects/' . $filename
];

$projects[] = $newProject;

$projectsJson = ['projects' => $projects];
file_put_contents($projectsFile, json_encode($projectsJson, JSON_PRETTY_PRINT));

echo json_encode([
    'success' => true,
    'message' => 'Project uploaded successfully',
    'project' => $newProject
]);
?>
