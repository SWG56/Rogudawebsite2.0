// ======================================
// LMS JAVASCRIPT - lms.js
// Learning Management System Functionality
// ======================================

/**
 * LMS Module for Student Dashboard
 */
const RogudaLMS = {
    
    /**
     * Load student course progress
     */
    loadCourseProgress: async function(studentEmail) {
        try {
            // In production, fetch from backend API
            const progress = Storage.get(`course_progress_${studentEmail}`) || this.generateDemoProgress();
            return progress;
        } catch (error) {
            console.error('Error loading course progress:', error);
            return null;
        }
    },
    
    /**
     * Generate demo progress data
     */
    generateDemoProgress: function() {
        return {
            enrolledCourses: [
                {
                    code: 'FD101',
                    name: 'Fashion Illustration & Technical Drawing',
                    progress: 75,
                    completedModules: 6,
                    totalModules: 8,
                    grade: 82,
                    status: 'in_progress'
                },
                {
                    code: 'FD102',
                    name: 'Fabric Science & Manipulation',
                    progress: 100,
                    completedModules: 6,
                    totalModules: 6,
                    grade: 88,
                    status: 'completed'
                },
                {
                    code: 'FD103',
                    name: 'Garment Construction Techniques',
                    progress: 60,
                    completedModules: 6,
                    totalModules: 10,
                    grade: 79,
                    status: 'in_progress'
                }
            ],
            overallProgress: 65,
            totalCredits: 85,
            earnedCredits: 55,
            gpa: 3.6,
            attendance: 92
        };
    },
    
    /**
     * Render course modules
     */
    renderCourseModules: function(course, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const html = `
            <div class="course-module glass-card">
                <div class="module-header">
                    <h3>${course.name}</h3>
                    <span class="module-code">${course.code}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.progress}%;"></div>
                </div>
                <div class="module-stats">
                    <span>${course.completedModules}/${course.totalModules} Modules</span>
                    <span>Grade: ${course.grade}%</span>
                    <span class="status-badge status-${course.status}">${course.status.replace('_', ' ')}</span>
                </div>
            </div>
        `;
        
        container.innerHTML += html;
    },
    
    /**
     * Load assignments
     */
    loadAssignments: async function(studentEmail) {
        const assignments = Storage.get(`assignments_${studentEmail}`) || [
            {
                id: 1,
                title: 'Fashion Illustration Portfolio',
                course: 'FD101',
                dueDate: '2025-12-15',
                status: 'pending',
                points: 50,
                submissionDate: null
            },
            {
                id: 2,
                title: 'Fabric Manipulation Project',
                course: 'FD102',
                dueDate: '2025-12-01',
                status: 'submitted',
                points: 40,
                submissionDate: '2025-11-28',
                grade: 88
            },
            {
                id: 3,
                title: 'Garment Construction Final',
                course: 'FD103',
                dueDate: '2025-12-20',
                status: 'not_started',
                points: 100,
                submissionDate: null
            }
        ];
        
        return assignments;
    },
    
    /**
     * Submit assignment
     */
    submitAssignment: async function(assignmentId, file, studentEmail) {
        // In production, upload to server via API
        const formData = new FormData();
        formData.append('assignment_file', file);
        formData.append('assignment_id', assignmentId);
        formData.append('email', studentEmail);
        
        try {
            const response = await fetch('api/upload_project.php', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${Storage.get('roguda_session')?.token}`
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('Assignment submitted successfully!', 'success');
                return true;
            } else {
                showToast(result.message || 'Submission failed', 'error');
                return false;
            }
        } catch (error) {
            console.error('Submission error:', error);
            showToast('Network error during submission', 'error');
            return false;
        }
    },
    
    /**
     * Load course materials
     */
    loadCourseMaterials: function(courseCode) {
        const materials = [
            {
                type: 'video',
                title: 'Introduction to Fashion Sketching',
                url: 'assets/videos/course_intro.mp4',
                duration: '15:30',
                completed: true
            },
            {
                type: 'pdf',
                title: 'Pattern Making Guide',
                url: 'assets/docs/pattern_guide.pdf',
                pages: 45,
                completed: false
            },
            {
                type: 'quiz',
                title: 'Module 1 Assessment',
                url: '#quiz-1',
                questions: 20,
                completed: false
            }
        ];
        
        return materials;
    },
    
    /**
     * Track learning activity
     */
    trackActivity: function(activityType, details) {
        const activities = Storage.get('learning_activities') || [];
        
        activities.push({
            type: activityType,
            details: details,
            timestamp: new Date().toISOString()
        });
        
        Storage.set('learning_activities', activities);
    },
    
    /**
     * Get upcoming deadlines
     */
    getUpcomingDeadlines: async function(studentEmail) {
        const assignments = await this.loadAssignments(studentEmail);
        const now = new Date();
        
        return assignments
            .filter(a => a.status !== 'submitted' && new Date(a.dueDate) > now)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5);
    },
    
    /**
     * Calculate GPA
     */
    calculateGPA: function(grades) {
        if (!grades || grades.length === 0) return 0;
        
        const total = grades.reduce((sum, grade) => {
            // Convert percentage to 4.0 scale
            let points = 0;
            if (grade >= 90) points = 4.0;
            else if (grade >= 80) points = 3.7;
            else if (grade >= 70) points = 3.0;
            else if (grade >= 60) points = 2.0;
            else if (grade >= 50) points = 1.0;
            
            return sum + points;
        }, 0);
        
        return (total / grades.length).toFixed(2);
    },
    
    /**
     * Generate certificate
     */
    generateCertificate: async function(courseCode, studentName) {
        // In production, call backend API to generate PDF certificate
        showToast('Certificate generation in progress...', 'info');
        
        setTimeout(() => {
            showToast('Certificate ready for download!', 'success');
            // Trigger download
        }, 2000);
    },
    
    /**
     * Initialize LMS dashboard
     */
    initDashboard: async function() {
        const session = Storage.get('roguda_session');
        
        if (!session) {
            window.location.href = 'login.html';
            return;
        }
        
        const progress = await this.loadCourseProgress(session.email);
        const assignments = await this.loadAssignments(session.email);
        
        // Render progress
        if (progress) {
            document.querySelectorAll('.course-container').forEach(container => {
                progress.enrolledCourses.forEach(course => {
                    this.renderCourseModules(course, container.id);
                });
            });
        }
        
        // Track page view
        this.trackActivity('dashboard_view', { page: 'lms_dashboard' });
    }
};

// Export for use in other modules
window.RogudaLMS = RogudaLMS;

// Auto-initialize on LMS pages
if (window.location.pathname.includes('dashboard.html')) {
    window.addEventListener('load', () => {
        RogudaLMS.initDashboard();
    });
}
