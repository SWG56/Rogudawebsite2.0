// ======================================
// POPIA JAVASCRIPT - popia.js
// POPIA Compliance & Consent Management
// ======================================

/**
 * POPIA Compliance Module
 * Manages user consent, data requests, and privacy settings
 */
const PopiaManager = {
    
    /**
     * Initialize consent banner
     */
    initConsentBanner: function() {
        const hasConsent = Storage.get('popia_cookie_consent');
        
        if (!hasConsent) {
            this.showConsentBanner();
        }
    },
    
    /**
     * Show consent banner
     */
    showConsentBanner: function() {
        const banner = document.createElement('div');
        banner.id = 'popiaBanner';
        banner.className = 'popia-banner glass-panel';
        banner.innerHTML = `
            <div class="popia-banner-content">
                <h4>🔒 Your Privacy Matters</h4>
                <p>We use essential cookies to provide our services. By using this site, you agree to our <a href="docs/popia_compliance.html" target="_blank" class="gold-link">POPIA Policy</a>.</p>
                <div class="banner-actions">
                    <button onclick="PopiaManager.acceptCookies()" class="btn-primary gold-btn">Accept</button>
                    <button onclick="PopiaManager.rejectCookies()" class="btn-secondary">Reject</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Add CSS if not already present
        if (!document.getElementById('popiaBannerStyles')) {
            const style = document.createElement('style');
            style.id = 'popiaBannerStyles';
            style.textContent = `
                .popia-banner {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    max-width: 400px;
                    padding: 25px;
                    z-index: 10000;
                    animation: slideInUp 0.5s ease;
                }
                
                .popia-banner h4 {
                    color: #D4AF37;
                    margin-bottom: 10px;
                }
                
                .popia-banner p {
                    margin-bottom: 20px;
                    font-size: 0.95rem;
                }
                
                .banner-actions {
                    display: flex;
                    gap: 10px;
                }
                
                .banner-actions button {
                    flex: 1;
                    padding: 10px 20px;
                }
                
                @keyframes slideInUp {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    /**
     * Accept cookies
     */
    acceptCookies: function() {
        Storage.set('popia_cookie_consent', {
            accepted: true,
            timestamp: new Date().toISOString(),
            version: '1.0'
        });
        
        this.removeBanner();
        showToast('Preferences saved', 'success');
    },
    
    /**
     * Reject cookies
     */
    rejectCookies: function() {
        Storage.set('popia_cookie_consent', {
            accepted: false,
            timestamp: new Date().toISOString(),
            version: '1.0'
        });
        
        this.removeBanner();
        showToast('Your choice has been saved. Some features may be limited.', 'info');
    },
    
    /**
     * Remove banner
     */
    removeBanner: function() {
        const banner = document.getElementById('popiaBanner');
        if (banner) {
            banner.style.animation = 'slideOutDown 0.5s ease';
            setTimeout(() => banner.remove(), 500);
        }
    },
    
    /**
     * Check if consent is given
     */
    hasConsent: function() {
        const consent = Storage.get('popia_cookie_consent');
        return consent && consent.accepted === true;
    },
    
    /**
     * Request data deletion (Right to be Forgotten)
     */
    requestDataDeletion: async function(email, reason) {
        try {
            const response = await fetch('api/data_request.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete',
                    email: email,
                    reason: reason
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('Data deletion request submitted. You will receive confirmation within 30 days.', 'success');
                return true;
            } else {
                showToast('Failed to submit request. Please contact privacy@roguda.co.za', 'error');
                return false;
            }
        } catch (error) {
            console.error('Data deletion request error:', error);
            showToast('Network error. Please try again or email privacy@roguda.co.za', 'error');
            return false;
        }
    },
    
    /**
     * Request data export (Right to Data Portability)
     */
    requestDataExport: async function(email) {
        try {
            const response = await fetch('api/data_request.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'export',
                    email: email
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('Data export request submitted. You will receive a download link via email.', 'success');
                return true;
            } else {
                showToast('Failed to submit request', 'error');
                return false;
            }
        } catch (error) {
            console.error('Data export request error:', error);
            showToast('Network error. Please try again.', 'error');
            return false;
        }
    },
    
    /**
     * Update marketing consent
     */
    updateMarketingConsent: function(consent) {
        const session = Storage.get('roguda_session');
        
        if (session) {
            session.marketingConsent = consent;
            Storage.set('roguda_session', session);
            showToast(`Marketing communications ${consent ? 'enabled' : 'disabled'}`, 'success');
        }
    },
    
    /**
     * Log data access (audit trail)
     */
    logDataAccess: function(action, dataType) {
        const logs = Storage.get('popia_access_logs') || [];
        
        logs.push({
            action: action,
            dataType: dataType,
            timestamp: new Date().toISOString(),
            ipAddress: 'CLIENT_IP' // In production, get from server
        });
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.shift();
        }
        
        Storage.set('popia_access_logs', logs);
    },
    
    /**
     * Initialize privacy settings page
     */
    initPrivacySettings: function() {
        const session = Storage.get('roguda_session');
        
        if (!session) return;
        
        const settingsContainer = document.getElementById('privacySettings');
        if (!settingsContainer) return;
        
        const html = `
            <div class="privacy-settings glass-panel">
                <h3 class="gold-text">Privacy & Data Management</h3>
                
                <div class="setting-item">
                    <label class="checkbox-container">
                        <input type="checkbox" id="marketingConsent" ${session.marketingConsent ? 'checked' : ''}>
                        <span class="checkbox-label">Receive marketing emails and updates</span>
                    </label>
                </div>
                
                <div class="setting-item">
                    <h4>Your Rights Under POPIA</h4>
                    <p>You have the right to:</p>
                    <ul style="margin-left: 20px;">
                        <li>Access your personal data</li>
                        <li>Correct inaccurate information</li>
                        <li>Request deletion of your data</li>
                        <li>Export your data</li>
                    </ul>
                </div>
                
                <div class="setting-actions">
                    <button onclick="PopiaManager.requestDataExport('${session.email}')" class="btn-secondary">
                        Export My Data
                    </button>
                    <button onclick="PopiaManager.confirmDataDeletion('${session.email}')" class="btn-secondary" style="color: #ff5555;">
                        Delete My Account
                    </button>
                </div>
                
                <div class="setting-footer">
                    <p>Questions about your data? Contact <a href="mailto:privacy@roguda.co.za" class="gold-link">privacy@roguda.co.za</a></p>
                    <p><a href="docs/popia_compliance.html" class="gold-link">Read full POPIA Policy →</a></p>
                </div>
            </div>
        `;
        
        settingsContainer.innerHTML = html;
        
        // Attach event listener
        document.getElementById('marketingConsent')?.addEventListener('change', function() {
            PopiaManager.updateMarketingConsent(this.checked);
        });
    },
    
    /**
     * Confirm data deletion
     */
    confirmDataDeletion: function(email) {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            const reason = prompt('Please tell us why you are leaving (optional):');
            this.requestDataDeletion(email, reason || 'No reason provided');
        }
    }
};

// Export
window.PopiaManager = PopiaManager;

// Auto-initialize consent banner
window.addEventListener('load', () => {
    PopiaManager.initConsentBanner();
    PopiaManager.logDataAccess('page_view', window.location.pathname);
});
