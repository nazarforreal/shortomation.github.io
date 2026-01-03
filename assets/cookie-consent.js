// Cookie Consent Management
(function() {
  'use strict';
  
  const CONSENT_KEY = 'cookie-consent';
  const CONSENT_TIMESTAMP_KEY = 'cookie-consent-timestamp';
  const CONSENT_EXPIRY_DAYS = 365;
  
  // Check if consent has been given and is still valid
  function hasValidConsent() {
    const consent = localStorage.getItem(CONSENT_KEY);
    const timestamp = localStorage.getItem(CONSENT_TIMESTAMP_KEY);
    
    if (!consent || !timestamp) {
      return false;
    }
    
    const consentDate = new Date(parseInt(timestamp));
    const expiryDate = new Date(consentDate);
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);
    
    return new Date() < expiryDate;
  }
  
  // Save consent preference
  function saveConsent(accepted) {
    localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'rejected');
    localStorage.setItem(CONSENT_TIMESTAMP_KEY, Date.now().toString());
  }
  
  // Enable analytics if consent is given
  function enableAnalytics() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }
  
  // Disable analytics if consent is rejected
  function disableAnalytics() {
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  }
  
  // Show the cookie consent banner
  function showConsentBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.add('cookie-consent--visible');
    }
  }
  
  // Hide the cookie consent banner
  function hideConsentBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('cookie-consent--visible');
      banner.classList.add('cookie-consent--hidden');
    }
  }
  
  // Handle accept button click
  function handleAccept() {
    saveConsent(true);
    enableAnalytics();
    hideConsentBanner();
  }
  
  // Handle reject button click
  function handleReject() {
    saveConsent(false);
    disableAnalytics();
    hideConsentBanner();
  }
  
  // Initialize cookie consent
  function init() {
    // Check if consent has already been given
    if (hasValidConsent()) {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (consent === 'accepted') {
        enableAnalytics();
      } else {
        disableAnalytics();
      }
      return;
    }
    
    // Show banner if no valid consent exists
    showConsentBanner();
    
    // Attach event listeners
    const acceptBtn = document.getElementById('cookie-accept');
    const rejectBtn = document.getElementById('cookie-reject');
    
    if (acceptBtn) {
      acceptBtn.addEventListener('click', handleAccept);
    }
    
    if (rejectBtn) {
      rejectBtn.addEventListener('click', handleReject);
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
