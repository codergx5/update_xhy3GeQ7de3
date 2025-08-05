// Configuration
const CONFIG = {
    // Update this with your actual APK file name in the repository
    apkFileName: 'pingkhor-vpn.apk',
    // Update this with your actual Telegram channel link
    telegramChannel: 'https://t.me/your_channel_username',
    // Download delay for UX (milliseconds)
    downloadDelay: 2000
};

// DOM Elements
const loadingOverlay = document.getElementById('loadingOverlay');
const telegramLink = document.querySelector('.telegram-link');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    addEventListeners();
});

function initializePage() {
    // Set telegram link
    if (telegramLink) {
        telegramLink.href = CONFIG.telegramChannel;
    }
    
    // Add some interactive animations
    addParticleEffect();
}

function addEventListeners() {
    // Download button click handler
    window.downloadAPK = function() {
        startDownload();
    };
    
    // Telegram link analytics (optional)
    if (telegramLink) {
        telegramLink.addEventListener('click', function() {
            trackEvent('telegram_click');
        });
    }
    
    // Add keyboard support for download
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const activeElement = document.activeElement;
            if (activeElement.classList.contains('download-btn')) {
                e.preventDefault();
                startDownload();
            }
        }
    });
}

function startDownload() {
    // Show loading overlay
    showLoading();
    
    // Track download attempt
    trackEvent('download_attempt');
    
    // Simulate download preparation
    setTimeout(() => {
        // Create download link and trigger download
        const downloadUrl = getDownloadUrl();
        triggerDownload(downloadUrl);
        
        // Hide loading after download starts
        setTimeout(() => {
            hideLoading();
            showDownloadSuccess();
        }, 1000);
    }, CONFIG.downloadDelay);
}

function getDownloadUrl() {
    // Get current repository info from GitHub Pages
    const currentUrl = window.location.href;
    const baseUrl = currentUrl.replace('/index.html', '').replace(/\/$/, '');
    
    // Construct APK download URL
    // This assumes the APK file is in the root of your repository
    return `${baseUrl}/${CONFIG.apkFileName}`;
}

function triggerDownload(url) {
    // Create temporary download link
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = CONFIG.apkFileName;
    downloadLink.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Track successful download
    trackEvent('download_started');
}

function showLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showDownloadSuccess() {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>دانلود شروع شد!</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
        z-index: 10000;
        font-family: 'Vazirmatn', sans-serif;
        font-weight: 500;
        animation: slideInRight 0.5s ease-out;
        direction: rtl;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification-content i {
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease-out reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

function addParticleEffect() {
    // Add subtle particle effect to background
    const particles = document.createElement('div');
    particles.className = 'particles';
    particles.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(100, 181, 246, 0.3);
            border-radius: 50%;
            animation: float ${8 + Math.random() * 4}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 8}s;
        `;
        particles.appendChild(particle);
    }
    
    // Add particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float {
            0% {
                transform: translateY(100vh) scale(0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) scale(1);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);
    document.body.appendChild(particles);
}

function trackEvent(eventName) {
    // Basic analytics tracking (you can integrate with Google Analytics or other services)
    console.log(`Event tracked: ${eventName}`);
    
    // Example integration with Google Analytics (uncomment if you have GA)
    /*
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'custom_parameter': 'pingkhor_vpn_update'
        });
    }
    */
}

// Handle offline/online status
window.addEventListener('online', function() {
    console.log('Connection restored');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    // You could show a notification about offline status
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden
        trackEvent('page_hidden');
    } else {
        // Page is visible
        trackEvent('page_visible');
    }
});

// Add smooth scrolling for any potential anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Preload critical resources
function preloadResources() {
    // Preload the APK file for faster downloads
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = getDownloadUrl();
    document.head.appendChild(link);
}

// Initialize preloading when page is loaded
window.addEventListener('load', preloadResources); 