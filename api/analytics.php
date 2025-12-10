<?php
// ========================================
// ANALYTICS API - Real-time Metrics
// ========================================
require_once 'includes/config.php';
require_once 'includes/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Function to get dashboard statistics
function getDashboardStats($conn) {
    $stats = [];
    
    // Total Students
    $result = $conn->query("SELECT COUNT(*) as total FROM applicants WHERE status = 'enrolled'");
    $stats['total_students'] = $result->fetch_assoc()['total'];
    
    // New Applications (last 30 days)
    $result = $conn->query("SELECT COUNT(*) as total FROM application_submissions WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
    $stats['new_applications'] = $result->fetch_assoc()['total'];
    
    // Completion Rate
    $result = $conn->query("SELECT 
        (COUNT(CASE WHEN enrollment_status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) as rate
        FROM enrollments WHERE enrollment_status IN ('completed', 'active')");
    $row = $result->fetch_assoc();
    $stats['completion_rate'] = round($row['rate'] ?? 0, 1);
    
    // Revenue (simulated - replace with actual payment table)
    $stats['revenue'] = 'R2.4M';
    
    // Calculate trends (compare to previous period)
    $result = $conn->query("SELECT COUNT(*) as last_period FROM applicants WHERE created_at BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND DATE_SUB(NOW(), INTERVAL 30 DAY)");
    $last_period = $result->fetch_assoc()['last_period'];
    $current_period = $stats['total_students'];
    $stats['student_trend'] = $last_period > 0 ? round((($current_period - $last_period) / $last_period) * 100, 1) : 0;
    
    return $stats;
}

// Function to get monthly enrollment data
function getMonthlyEnrollments($conn) {
    $result = $conn->query("
        SELECT 
            DATE_FORMAT(created_at, '%b') as month,
            COUNT(*) as count
        FROM application_submissions
        WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY MONTH(submitted_at), DATE_FORMAT(created_at, '%b')
        ORDER BY submitted_at ASC
    ");
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    return $data;
}

// Function to get program distribution
function getProgramDistribution($conn) {
    $result = $conn->query("
        SELECT 
            program,
            COUNT(*) as student_count,
            ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM applicants WHERE status = 'enrolled')), 1) as percentage
        FROM applicants
        WHERE status = 'enrolled'
        GROUP BY program
        ORDER BY student_count DESC
    ");
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    return $data;
}

// Function to get recent activity
function getRecentActivity($conn) {
    $activities = [];
    
    // Recent applications
    $result = $conn->query("
        SELECT 
            CONCAT(first_name, ' ', last_name) as name,
            program,
            submitted_at,
            'application' as type
        FROM application_submissions
        ORDER BY submitted_at DESC
        LIMIT 5
    ");
    
    while ($row = $result->fetch_assoc()) {
        $activities[] = [
            'type' => 'application',
            'icon' => '📝',
            'title' => 'New Application Received',
            'description' => $row['name'] . ' applied for ' . $row['program'],
            'time' => timeAgo($row['submitted_at'])
        ];
    }
    
    // Recent enrollments
    $result = $conn->query("
        SELECT 
            a.name,
            e.program,
            e.enrollment_date
        FROM enrollments e
        INNER JOIN applicants a ON e.student_id = a.id
        ORDER BY e.enrollment_date DESC
        LIMIT 3
    ");
    
    while ($row = $result->fetch_assoc()) {
        $activities[] = [
            'type' => 'enrollment',
            'icon' => '🎓',
            'title' => 'Student Enrolled',
            'description' => $row['name'] . ' enrolled in ' . $row['program'],
            'time' => timeAgo($row['enrollment_date'])
        ];
    }
    
    // Sort by time and limit
    usort($activities, function($a, $b) {
        return strtotime($b['time']) - strtotime($a['time']);
    });
    
    return array_slice($activities, 0, 5);
}

// Helper function to convert timestamp to relative time
function timeAgo($datetime) {
    $time = strtotime($datetime);
    $diff = time() - $time;
    
    if ($diff < 60) return $diff . ' seconds ago';
    if ($diff < 3600) return floor($diff / 60) . ' minutes ago';
    if ($diff < 86400) return floor($diff / 3600) . ' hours ago';
    if ($diff < 604800) return floor($diff / 86400) . ' days ago';
    
    return date('M j, Y', $time);
}

// API Endpoint Handler
$action = $_GET['action'] ?? 'dashboard';

try {
    switch ($action) {
        case 'dashboard':
            $response = [
                'success' => true,
                'stats' => getDashboardStats($conn),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'monthly':
            $response = [
                'success' => true,
                'data' => getMonthlyEnrollments($conn),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'programs':
            $response = [
                'success' => true,
                'data' => getProgramDistribution($conn),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'activity':
            $response = [
                'success' => true,
                'data' => getRecentActivity($conn),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        case 'all':
            $response = [
                'success' => true,
                'stats' => getDashboardStats($conn),
                'monthly' => getMonthlyEnrollments($conn),
                'programs' => getProgramDistribution($conn),
                'activity' => getRecentActivity($conn),
                'timestamp' => date('Y-m-d H:i:s')
            ];
            break;
            
        default:
            $response = [
                'success' => false,
                'error' => 'Invalid action'
            ];
    }
    
    echo json_encode($response);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>
