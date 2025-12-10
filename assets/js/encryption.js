// ======================================
// ENCRYPTION UTILITY - encryption.js
// AES/SHA-256 Placeholder for Future Implementation
// ======================================

/**
 * Simple encryption utilities
 * NOTE: This is a placeholder. For production, use a proper crypto library
 * like CryptoJS or Web Crypto API
 */

const RogudaCrypto = {
    
    /**
     * Simple Base64 encoding (NOT secure for sensitive data)
     * @param {string} data - Data to encode
     * @returns {string} Encoded string
     */
    encode: function(data) {
        try {
            return btoa(data);
        } catch (e) {
            console.error('Encoding error:', e);
            return null;
        }
    },
    
    /**
     * Simple Base64 decoding
     * @param {string} data - Data to decode
     * @returns {string} Decoded string
     */
    decode: function(data) {
        try {
            return atob(data);
        } catch (e) {
            console.error('Decoding error:', e);
            return null;
        }
    },
    
    /**
     * Generate simple hash (NOT cryptographically secure)
     * For production, implement SHA-256 using Web Crypto API
     * @param {string} data - Data to hash
     * @returns {string} Hash string
     */
    simpleHash: function(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    },
    
    /**
     * SHA-256 Hash using Web Crypto API (async)
     * @param {string} message - Message to hash
     * @returns {Promise<string>} Hash hex string
     */
    sha256: async function(message) {
        if (!window.crypto || !window.crypto.subtle) {
            console.warn('Web Crypto API not available. Using simple hash.');
            return this.simpleHash(message);
        }
        
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    },
    
    /**
     * Generate random token
     * @param {number} length - Token length
     * @returns {string} Random token
     */
    generateToken: function(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        
        if (window.crypto && window.crypto.getRandomValues) {
            const values = new Uint32Array(length);
            crypto.getRandomValues(values);
            for (let i = 0; i < length; i++) {
                token += chars[values[i] % chars.length];
            }
        } else {
            // Fallback to Math.random (less secure)
            for (let i = 0; i < length; i++) {
                token += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        
        return token;
    },
    
    /**
     * Encrypt data using AES (requires CryptoJS library)
     * This is a placeholder - implement with proper library
     * @param {string} data - Data to encrypt
     * @param {string} key - Encryption key
     * @returns {string} Encrypted data
     */
    aesEncrypt: function(data, key) {
        console.warn('AES encryption not implemented. Install CryptoJS library for production use.');
        // Example with CryptoJS (when added):
        // return CryptoJS.AES.encrypt(data, key).toString();
        return this.encode(data); // Fallback to base64
    },
    
    /**
     * Decrypt data using AES (requires CryptoJS library)
     * This is a placeholder - implement with proper library
     * @param {string} encrypted - Encrypted data
     * @param {string} key - Decryption key
     * @returns {string} Decrypted data
     */
    aesDecrypt: function(encrypted, key) {
        console.warn('AES decryption not implemented. Install CryptoJS library for production use.');
        // Example with CryptoJS (when added):
        // const bytes = CryptoJS.AES.decrypt(encrypted, key);
        // return bytes.toString(CryptoJS.enc.Utf8);
        return this.decode(encrypted); // Fallback to base64
    },
    
    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {object} Validation result
     */
    validatePassword: function(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        const strength = [
            password.length >= minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar
        ].filter(Boolean).length;
        
        return {
            isValid: password.length >= minLength,
            strength: strength,
            strengthText: strength < 2 ? 'Weak' : strength < 4 ? 'Medium' : 'Strong',
            suggestions: [
                password.length < minLength ? `Use at least ${minLength} characters` : null,
                !hasUpperCase ? 'Add uppercase letters' : null,
                !hasLowerCase ? 'Add lowercase letters' : null,
                !hasNumbers ? 'Add numbers' : null,
                !hasSpecialChar ? 'Add special characters' : null
            ].filter(Boolean)
        };
    }
};

// Export for use in other scripts
window.RogudaCrypto = RogudaCrypto;

// Example usage (for testing):
/*
console.log('Encryption Test:');
const testData = 'Hello Roguda!';
const encoded = RogudaCrypto.encode(testData);
console.log('Encoded:', encoded);
console.log('Decoded:', RogudaCrypto.decode(encoded));

RogudaCrypto.sha256('test123').then(hash => {
    console.log('SHA-256 Hash:', hash);
});

const token = RogudaCrypto.generateToken(16);
console.log('Random Token:', token);

const passwordCheck = RogudaCrypto.validatePassword('Test123!');
console.log('Password Strength:', passwordCheck);
*/
