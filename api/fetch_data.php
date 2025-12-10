<?php
// ======================================
// FETCH DATA API - fetch_data.php
// Generic Data Retrieval Endpoint
// ======================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$type = isset($_GET['type']) ? $_GET['type'] : '';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($type) {
    case 'courses':
        $file = '../data/courses.json';
        break;
    case 'projects':
        $file = '../data/projects.json';
        break;
    case 'incubator':
        $file = '../data/incubator_projects.json';
        break;
    case 'materials':
        $file = '../data/materials.json';
        break;
    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid data type']);
        exit;
}

if (!file_exists($file)) {
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Data not found']);
    exit;
}

$data = json_decode(file_get_contents($file), true);

// If ID is specified, return single item
if ($id !== null && isset($data['projects'])) {
    foreach ($data['projects'] as $item) {
        if ($item['id'] == $id) {
            echo json_encode(['success' => true, 'data' => $item]);
            exit;
        }
    }
    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Item not found']);
    exit;
}

// Return all data
echo json_encode(['success' => true, 'data' => $data]);
?>
