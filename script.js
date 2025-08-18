// Get DOM elements
const background = document.getElementById('background');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// 
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Convert mouse position to percentages
    const mouseXPercent = (mouseX / windowWidth) * 100;
    const mouseYPercent = (mouseY / windowHeight) * 100;
    
    // Update CSS custom properties for the circle position
    background.style.setProperty('--mouse-x', mouseXPercent + '%');
    background.style.setProperty('--mouse-y', mouseYPercent + '%');
    
    // Add active class to show the circle
    background.classList.add('active');
});

// Hide circle when mouse leaves the window
document.addEventListener('mouseleave', () => {
    background.classList.remove('active');
});

// Alternative hover effect for mobile/touch devices
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const mouseX = touch.clientX;
    const mouseY = touch.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Convert touch position to percentages
    const mouseXPercent = (mouseX / windowWidth) * 100;
    const mouseYPercent = (mouseY / windowHeight) * 100;
    
    // Update CSS custom properties for the circle position
    background.style.setProperty('--mouse-x', mouseXPercent + '%');
    background.style.setProperty('--mouse-y', mouseYPercent + '%');
    
    // Add active class to show the circle
    background.classList.add('active');
});

document.addEventListener('touchend', () => {
    background.classList.remove('active');
});

// Form validation and submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Basic validation
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Simulate login process
    // showMessage('Signing in...', 'loading');
    
    // setTimeout(() => {
    //     // Simulate successful login
    //     showMessage('Login successful! Redirecting...', 'success');
        
    //     // Redirect after 2 seconds (replace with actual redirect)
    //     setTimeout(() => {
    //         // window.location.href = '/dashboard';
    //         console.log('Redirecting to dashboard...');
    //     }, 2000);
    // }, 1500);
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message function
// function showMessage(message, type) {
//     // Remove any existing messages
//     const existingMessage = document.querySelector('.message');
//     if (existingMessage) {
//         existingMessage.remove();
//     }
    
//     // Create message element
//     const messageDiv = document.createElement('div');
//     messageDiv.className = `message ${type}`;
//     messageDiv.textContent = message;
    
//     // Add styles for different message types
//     const messageStyles = {
//         success: {
//             backgroundColor: '#10b981',
//             color: 'white'
//         },
//         error: {
//             backgroundColor: '#ef4444',
//             color: 'white'
//         },
//         loading: {
//             backgroundColor: '#3b82f6',
//             color: 'white'
//         }
//     };
    
//     Object.assign(messageDiv.style, {
//         position: 'fixed',
//         top: '20px',
//         right: '20px',
//         padding: '12px 20px',
//         borderRadius: '8px',
//         fontWeight: '500',
//         zIndex: '1000',
//         opacity: '0',
//         transform: 'translateX(100%)',
//         transition: 'all 0.3s ease',
//         ...messageStyles[type]
//     });
    
//     document.body.appendChild(messageDiv);
    
//     // Animate in
//     setTimeout(() => {
//         messageDiv.style.opacity = '1';
//         messageDiv.style.transform = 'translateX(0)';
//     }, 100);
    
//     // Auto remove after 4 seconds (except for loading messages)
//     if (type !== 'loading') {
//         setTimeout(() => {
//             messageDiv.style.opacity = '0';
//             messageDiv.style.transform = 'translateX(100%)';
//             setTimeout(() => {
//                 if (messageDiv.parentNode) {
//                     messageDiv.remove();
//                 }
//             }, 300);
//         }, 4000);
//     }
// }

// Input focus effects
// emailInput.addEventListener('focus', () => {
//     emailInput.parentNode.classList.add('focused');
// });

// emailInput.addEventListener('blur', () => {
//     emailInput.parentNode.classList.remove('focused');
// });

// passwordInput.addEventListener('focus', () => {
//     passwordInput.parentNode.classList.add('focused');
// });

// passwordInput.addEventListener('blur', () => {
//     passwordInput.parentNode.classList.remove('focused');
// });

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Clear any focused inputs
        document.activeElement.blur();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animation delay
    setTimeout(() => {
        const loginBox = document.querySelector('.login-box');
        loginBox.style.opacity = '1';
        loginBox.style.transform = 'translateY(0)';
    }, 100);
    
    console.log('Login page loaded successfully');
});