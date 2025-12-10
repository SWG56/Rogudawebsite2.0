<?php
// ========================================
// ADMIN DASHBOARD - Applicant Management
// ========================================
session_start();
require_once '../includes/config.php';
require_once '../includes/database.php';

// Simple admin authentication (enhance this in production)
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: admin-login.php");
    exit;
}

// Get statistics
$stats = [];

// Total applicants
$result = $conn->query("SELECT COUNT(*) as total FROM applicants");
$stats['total'] = $result->fetch_assoc()['total'];

// By program
$programs = ['Fashion Design', 'Pattern Making', 'Clothing Production'];
foreach ($programs as $program) {
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM applicants WHERE program = ?");
    $stmt->bind_param("s", $program);
    $stmt->execute();
    $stats[$program] = $stmt->get_result()->fetch_assoc()['count'];
    $stmt->close();
}

// Get all applicants
$applicants = [];
$result = $conn->query("SELECT * FROM applicants ORDER BY created_at DESC");
while ($row = $result->fetch_assoc()) {
    $applicants[] = $row;
}

// Handle export
if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    header('Content-Type: text/csv');
    header('Content-Disposition: attachment;filename=applicants_' . date('Y-m-d') . '.csv');
    
    $output = fopen('php://output', 'w');
    fputcsv($output, ['ID', 'Name', 'Email', 'Phone', 'Program', 'Status', 'Applied Date']);
    
    foreach ($applicants as $applicant) {
        fputcsv($output, [
            $applicant['id'],
            $applicant['name'],
            $applicant['email'],
            $applicant['phone'] ?? '',
            $applicant['program'],
            $applicant['status'] ?? 'pending',
            $applicant['created_at']
        ]);
    }
    
    fclose($output);
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | Roguda</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/theme.css">
    <style>
        .admin-container { max-width: 1400px; margin: 0 auto; padding: 2rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-box { background: rgba(255,255,255,0.9); padding: 1.5rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2.5rem; color: var(--gold); font-weight: 700; }
        .stat-label { color: var(--earth); margin-top: 0.5rem; }
        .applicants-table { width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .applicants-table th { background: var(--gold); color: var(--charcoal); padding: 1rem; text-align: left; }
        .applicants-table td { padding: 1rem; border-bottom: 1px solid #eee; }
        .applicants-table tr:hover { background: rgba(199,158,79,0.05); }
        .badge { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
        .badge-pending { background: #ffc107; color: #000; }
        .badge-accepted { background: #28a745; color: #fff; }
        .badge-rejected { background: #dc3545; color: #fff; }
        .filter-bar { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .filter-bar select, .filter-bar input { padding: 0.8rem; border: 2px solid rgba(199,158,79,0.3); border-radius: 8px; font-size: 1rem; }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <div>
                <h1 style="font-family:var(--font-title); color:var(--gold); margin-bottom:0.5rem;">Admin Dashboard</h1>
                <p style="color:var(--earth);">Manage applications and student data</p>
            </div>
            <div style="display:flex; gap:1rem;">
                <a href="?export=csv" class="btn-secondary">📥 Export CSV</a>
                <a href="admin-logout.php" class="btn-primary">Logout</a>
            </div>
        </div>
        
        <div class="stats-row">
            <div class="stat-box">
                <div class="stat-number"><?php echo $stats['total']; ?></div>
                <div class="stat-label">Total Applicants</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?php echo $stats['Fashion Design']; ?></div>
                <div class="stat-label">Fashion Design</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?php echo $stats['Pattern Making']; ?></div>
                <div class="stat-label">Pattern Making</div>
            </div>
            <div class="stat-box">
                <div class="stat-number"><?php echo $stats['Clothing Production']; ?></div>
                <div class="stat-label">Clothing Production</div>
            </div>
        </div>

        <!-- Moodle Admin Controls -->
        <div style="background:linear-gradient(135deg,rgba(52,152,219,0.1),rgba(41,128,185,0.15));border-radius:12px;padding:2rem;margin-bottom:2rem;border:2px solid #3498db;">
            <h2 style="margin:0 0 1.5rem 0;color:#2980b9;display:flex;align-items:center;gap:0.5rem;"><span style="font-size:1.5rem;">📚</span> Moodle LMS Management</h2>
            
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1.5rem;">
                <div style="background:white;padding:1.5rem;border-radius:8px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <div style="font-size:2rem;margin-bottom:0.5rem;">👨‍🎓</div>
                    <div style="font-size:1.8rem;font-weight:700;color:#3498db;" id="moodleStudents">247</div>
                    <div style="color:#7f8c8d;font-size:0.9rem;">Active Students</div>
                </div>
                <div style="background:white;padding:1.5rem;border-radius:8px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <div style="font-size:2rem;margin-bottom:0.5rem;">📖</div>
                    <div style="font-size:1.8rem;font-weight:700;color:#3498db;" id="moodleCourses">12</div>
                    <div style="color:#7f8c8d;font-size:0.9rem;">Active Courses</div>
                </div>
                <div style="background:white;padding:1.5rem;border-radius:8px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <div style="font-size:2rem;margin-bottom:0.5rem;">✅</div>
                    <div style="font-size:1.8rem;font-weight:700;color:#27ae60;" id="moodleSubmissions">89</div>
                    <div style="color:#7f8c8d;font-size:0.9rem;">Pending Grading</div>
                </div>
                <div style="background:white;padding:1.5rem;border-radius:8px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <div style="font-size:2rem;margin-bottom:0.5rem;">📊</div>
                    <div style="font-size:1.8rem;font-weight:700;color:#e67e22;" id="moodleAvgGrade">82%</div>
                    <div style="color:#7f8c8d;font-size:0.9rem;">Avg. Class Grade</div>
                </div>
            </div>

            <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1.5rem;">
                <button onclick="openMoodleAdmin()" style="background:#3498db;color:white;border:none;padding:0.8rem 1.5rem;border-radius:8px;cursor:pointer;font-weight:600;transition:all 0.3s;" onmouseover="this.style.background='#2980b9'" onmouseout="this.style.background='#3498db'">
                    🔧 Open Moodle Admin
                </button>
                <button onclick="manageCourses()" style="background:#27ae60;color:white;border:none;padding:0.8rem 1.5rem;border-radius:8px;cursor:pointer;font-weight:600;transition:all 0.3s;" onmouseover="this.style.background='#229954'" onmouseout="this.style.background='#27ae60'">
                    📚 Manage Courses
                </button>
                <button onclick="viewReports()" style="background:#e67e22;color:white;border:none;padding:0.8rem 1.5rem;border-radius:8px;cursor:pointer;font-weight:600;transition:all 0.3s;" onmouseover="this.style.background='#d35400'" onmouseout="this.style.background='#e67e22'">
                    📊 View Reports
                </button>
                <button onclick="manageUsers()" style="background:#9b59b6;color:white;border:none;padding:0.8rem 1.5rem;border-radius:8px;cursor:pointer;font-weight:600;transition:all 0.3s;" onmouseover="this.style.background='#8e44ad'" onmouseout="this.style.background='#9b59b6'">
                    👥 Manage Users
                </button>
            </div>

            <!-- Embedded Moodle Admin Panel -->
            <div style="background:white;border-radius:8px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                <div style="background:#2c3e50;padding:1rem;display:flex;justify-content:space-between;align-items:center;">
                    <h3 style="margin:0;color:white;font-size:1rem;">Moodle Admin Panel</h3>
                    <button onclick="toggleMoodleAdminFullscreen()" style="background:rgba(255,255,255,0.2);border:none;padding:0.5rem 1rem;border-radius:6px;color:white;cursor:pointer;font-weight:600;">⛶ Fullscreen</button>
                </div>
                <div id="moodleAdminContainer" style="position:relative;height:600px;">
                    <iframe 
                        id="moodleAdminFrame"
                        src="https://moodle.roguda.co.za/admin" 
                        style="width:100%;height:100%;border:none;"
                        title="Moodle Admin Panel"
                    ></iframe>
                    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;">
                        <div style="font-size:3rem;margin-bottom:1rem;opacity:0.3;">🔧</div>
                        <p style="color:#7f8c8d;font-size:1.1rem;opacity:0.5;">Configure Moodle Admin URL</p>
                    </div>
                </div>
            </div>

            <!-- Quick Actions for Teachers/Instructors -->
            <div style="margin-top:1.5rem;background:rgba(255,255,255,0.7);padding:1.5rem;border-radius:8px;">
                <h4 style="margin:0 0 1rem 0;color:#2c3e50;">📋 Quick Instructor Actions</h4>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;">
                    <button onclick="createAssignment()" style="background:white;border:2px solid #3498db;padding:1rem;border-radius:8px;cursor:pointer;text-align:left;transition:all 0.3s;" onmouseover="this.style.borderColor='#2980b9';this.style.boxShadow='0 4px 12px rgba(52,152,219,0.2)'" onmouseout="this.style.borderColor='#3498db';this.style.boxShadow='none'">
                        <div style="font-size:1.5rem;margin-bottom:0.5rem;">📝</div>
                        <div style="font-weight:600;color:#2c3e50;">Create Assignment</div>
                    </button>
                    <button onclick="gradeSubmissions()" style="background:white;border:2px solid #27ae60;padding:1rem;border-radius:8px;cursor:pointer;text-align:left;transition:all 0.3s;" onmouseover="this.style.borderColor='#229954';this.style.boxShadow='0 4px 12px rgba(39,174,96,0.2)'" onmouseout="this.style.borderColor='#27ae60';this.style.boxShadow='none'">
                        <div style="font-size:1.5rem;margin-bottom:0.5rem;">✅</div>
                        <div style="font-weight:600;color:#2c3e50;">Grade Submissions</div>
                    </button>
                    <button onclick="uploadResources()" style="background:white;border:2px solid #e67e22;padding:1rem;border-radius:8px;cursor:pointer;text-align:left;transition:all 0.3s;" onmouseover="this.style.borderColor='#d35400';this.style.boxShadow='0 4px 12px rgba(230,126,34,0.2)'" onmouseout="this.style.borderColor='#e67e22';this.style.boxShadow='none'">
                        <div style="font-size:1.5rem;margin-bottom:0.5rem;">📤</div>
                        <div style="font-weight:600;color:#2c3e50;">Upload Resources</div>
                    </button>
                    <button onclick="viewAnalytics()" style="background:white;border:2px solid #9b59b6;padding:1rem;border-radius:8px;cursor:pointer;text-align:left;transition:all 0.3s;" onmouseover="this.style.borderColor='#8e44ad';this.style.boxShadow='0 4px 12px rgba(155,89,182,0.2)'" onmouseout="this.style.borderColor='#9b59b6';this.style.boxShadow='none'">
                        <div style="font-size:1.5rem;margin-bottom:0.5rem;">📈</div>
                        <div style="font-weight:600;color:#2c3e50;">View Analytics</div>
                    </button>
                </div>
            </div>
        </div>
        
        <div class="filter-bar">
            <select id="programFilter" onchange="filterTable()">
                <option value="">All Programs</option>
                <option value="Fashion Design">Fashion Design</option>
                <option value="Pattern Making">Pattern Making</option>
                <option value="Clothing Production">Clothing Production</option>
            </select>
            <input type="text" id="searchInput" placeholder="Search by name or email..." onkeyup="filterTable()" style="flex:1; min-width:200px;">
        </div>
        
        <table class="applicants-table" id="applicantsTable">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Program</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($applicants as $applicant): ?>
                <tr>
                    <td><?php echo $applicant['id']; ?></td>
                    <td><?php echo htmlspecialchars($applicant['name']); ?></td>
                    <td><?php echo htmlspecialchars($applicant['email']); ?></td>
                    <td><?php echo htmlspecialchars($applicant['phone'] ?? 'N/A'); ?></td>
                    <td><?php echo htmlspecialchars($applicant['program']); ?></td>
                    <td><?php echo date('Y-m-d', strtotime($applicant['created_at'])); ?></td>
                    <td>
                        <span class="badge badge-<?php echo $applicant['status'] ?? 'pending'; ?>">
                            <?php echo ucfirst($applicant['status'] ?? 'pending'); ?>
                        </span>
                    </td>
                    <td>
                        <button onclick="viewDetails(<?php echo $applicant['id']; ?>)" class="btn-secondary" style="font-size:0.85rem; padding:0.5rem 1rem;">View</button>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    
    <script>
        function filterTable() {
            const programFilter = document.getElementById('programFilter').value.toLowerCase();
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            const table = document.getElementById('applicantsTable');
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].getElementsByTagName('td');
                const name = cells[1].textContent.toLowerCase();
                const email = cells[2].textContent.toLowerCase();
                const program = cells[4].textContent.toLowerCase();
                
                let showRow = true;
                
                if (programFilter && !program.includes(programFilter)) {
                    showRow = false;
                }
                
                if (searchInput && !name.includes(searchInput) && !email.includes(searchInput)) {
                    showRow = false;
                }
                
                rows[i].style.display = showRow ? '' : 'none';
            }
        }
        
        function viewDetails(id) {
            window.location.href = 'applicant-details.php?id=' + id;
        }

        // Moodle Admin Functions
        function openMoodleAdmin() {
            window.open('https://moodle.roguda.co.za/admin', '_blank');
        }

        function manageCourses() {
            document.getElementById('moodleAdminFrame').src = 'https://moodle.roguda.co.za/course/management.php';
        }

        function viewReports() {
            document.getElementById('moodleAdminFrame').src = 'https://moodle.roguda.co.za/report/index.php';
        }

        function manageUsers() {
            document.getElementById('moodleAdminFrame').src = 'https://moodle.roguda.co.za/admin/user.php';
        }

        function toggleMoodleAdminFullscreen() {
            const container = document.getElementById('moodleAdminContainer');
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => {
                    alert('Error: ' + err.message);
                });
            } else {
                document.exitFullscreen();
            }
        }

        function createAssignment() {
            window.open('https://moodle.roguda.co.za/mod/assign/view.php?action=addsubmission', '_blank');
        }

        function gradeSubmissions() {
            window.open('https://moodle.roguda.co.za/mod/assign/view.php?action=grading', '_blank');
        }

        function uploadResources() {
            window.open('https://moodle.roguda.co.za/course/modedit.php', '_blank');
        }

        function viewAnalytics() {
            document.getElementById('moodleAdminFrame').src = 'https://moodle.roguda.co.za/admin/tool/analytics/index.php';
        }

        // Load Moodle stats from API
        async function loadMoodleAdminStats() {
            try {
                const response = await fetch('../api/moodle-admin-stats.php');
                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('moodleStudents').textContent = data.students || '247';
                    document.getElementById('moodleCourses').textContent = data.courses || '12';
                    document.getElementById('moodleSubmissions').textContent = data.submissions || '89';
                    document.getElementById('moodleAvgGrade').textContent = data.avgGrade || '82%';
                }
            } catch (error) {
                console.log('Moodle admin stats not available:', error);
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', function() {
            loadMoodleAdminStats();
        });
    </script>
</body>
</html>
