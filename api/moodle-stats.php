<?php
/**
 * Moodle Stats API for Student Dashboard
 * Fetches student-specific Moodle data
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../includes/config.php';
require_once '../includes/database.php';

// Check if user is logged in
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$userId = $_SESSION['user_id'];

// ========================================
// MOODLE API CONFIGURATION
// ========================================
// Replace with your actual Moodle installation details
define('MOODLE_URL', 'https://moodle.roguda.co.za');
define('MOODLE_TOKEN', 'YOUR_MOODLE_WEB_SERVICE_TOKEN'); // Generate from Moodle Admin
define('MOODLE_REST_FORMAT', 'json');

/**
 * Make Moodle API Request
 */
function callMoodleAPI($function, $params = []) {
    $url = MOODLE_URL . '/webservice/rest/server.php';
    
    $requestParams = array_merge([
        'wstoken' => MOODLE_TOKEN,
        'wsfunction' => $function,
        'moodlewsrestformat' => MOODLE_REST_FORMAT
    ], $params);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($requestParams));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

/**
 * Get Student's Enrolled Courses
 */
function getEnrolledCourses($moodleUserId) {
    return callMoodleAPI('core_enrol_get_users_courses', [
        'userid' => $moodleUserId
    ]);
}

/**
 * Get Course Completion Status
 */
function getCourseCompletion($moodleUserId, $courseId) {
    return callMoodleAPI('core_completion_get_course_completion_status', [
        'userid' => $moodleUserId,
        'courseid' => $courseId
    ]);
}

/**
 * Get Student Grades
 */
function getStudentGrades($moodleUserId, $courseId) {
    return callMoodleAPI('gradereport_user_get_grade_items', [
        'userid' => $moodleUserId,
        'courseid' => $courseId
    ]);
}

/**
 * Get Assignments for Student
 */
function getAssignments($courseIds) {
    return callMoodleAPI('mod_assign_get_assignments', [
        'courseids' => $courseIds
    ]);
}

// ========================================
// FETCH DATA
// ========================================

try {
    // Get user's Moodle ID from database (you need to store this during registration)
    $stmt = $conn->prepare("SELECT moodle_user_id FROM applicants WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();
    
    if (!$user || !$user['moodle_user_id']) {
        // Return mock data if Moodle not configured
        echo json_encode([
            'courses' => 4,
            'completed' => 12,
            'pending' => 3,
            'averageGrade' => '85%',
            'mock' => true,
            'message' => 'Moodle integration pending - showing sample data'
        ]);
        exit;
    }
    
    $moodleUserId = $user['moodle_user_id'];
    
    // Fetch enrolled courses
    $courses = getEnrolledCourses($moodleUserId);
    $totalCourses = count($courses);
    
    // Calculate completion and grades
    $completedAssignments = 0;
    $pendingAssignments = 0;
    $totalGrades = 0;
    $gradeCount = 0;
    
    foreach ($courses as $course) {
        $courseId = $course['id'];
        
        // Get completion status
        $completion = getCourseCompletion($moodleUserId, $courseId);
        if ($completion && isset($completion['completionstatus'])) {
            if ($completion['completionstatus']['complete']) {
                $completedAssignments++;
            }
        }
        
        // Get grades
        $grades = getStudentGrades($moodleUserId, $courseId);
        if ($grades && isset($grades['usergrades'])) {
            foreach ($grades['usergrades'] as $grade) {
                if (isset($grade['grade'])) {
                    $totalGrades += floatval($grade['grade']);
                    $gradeCount++;
                }
            }
        }
    }
    
    // Get pending assignments
    $courseIds = array_column($courses, 'id');
    $assignments = getAssignments($courseIds);
    
    if ($assignments && isset($assignments['courses'])) {
        foreach ($assignments['courses'] as $course) {
            if (isset($course['assignments'])) {
                foreach ($course['assignments'] as $assignment) {
                    // Check if submitted
                    if (!$assignment['submitted']) {
                        $pendingAssignments++;
                    }
                }
            }
        }
    }
    
    // Calculate average grade
    $averageGrade = $gradeCount > 0 ? round($totalGrades / $gradeCount, 0) : 0;
    
    // Return data
    echo json_encode([
        'courses' => $totalCourses,
        'completed' => $completedAssignments,
        'pending' => $pendingAssignments,
        'averageGrade' => $averageGrade . '%',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    // Return mock data on error
    echo json_encode([
        'courses' => 4,
        'completed' => 12,
        'pending' => 3,
        'averageGrade' => '85%',
        'mock' => true,
        'error' => $e->getMessage()
    ]);
}

$conn->close();
?>
