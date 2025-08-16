        const container = document.getElementById('container');
        const revealCircle = document.getElementById('revealCircle');
        const cursor = document.getElementById('cursor');
        const particles = document.getElementById('particles');
        let isHovering = false;

        // Create floating particles
        function createParticles() {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                particles.appendChild(particle);
            }
        }

        // Custom cursor movement
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';

            // Reveal effect on hover
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            revealCircle.style.left = x - 100 + 'px';
            revealCircle.style.top = y - 100 + 'px';
            revealCircle.style.opacity = '1';
        });

        // Hide reveal circle when mouse leaves
        container.addEventListener('mouseleave', () => {
            revealCircle.style.opacity = '0';
        });

        // Enhanced hover effects for interactive elements
        const interactiveElements = document.querySelectorAll('.form-input, .login-button, .forgot-password a');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(78, 205, 196, 0.4)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(78, 205, 196, 0.2)';
            });
        });

        // Form submission
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add loading animation
            const button = document.querySelector('.login-button');
            const originalText = button.textContent;
            button.textContent = 'ACCESSING...';
            button.style.background = 'linear-gradient(135deg, #666, #888)';
            
            // Simulate login process
            setTimeout(() => {
                button.textContent = 'ACCESS GRANTED';
                button.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                
                setTimeout(() => {
                    // Fade out effect
                    document.body.style.transition = 'opacity 1s ease';
                    document.body.style.opacity = '0';
                    
                    setTimeout(() => {
                        alert('Welcome! Login successful.');
                        // Reset
                        document.body.style.opacity = '1';
                        button.textContent = originalText;
                        button.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
                        document.getElementById('loginForm').reset();
                    }, 1000);
                }, 1000);
            }, 2000);
        });

        // Forgot password link
        document.getElementById('forgotLink').addEventListener('click', (e) => {
            e.preventDefault();
            alert('Password recovery email would be sent to your registered email address.');
        });

        // Initialize
        createParticles();

        // Add subtle screen glitch effect occasionally
        setInterval(() => {
            if (Math.random() < 0.1) {
                document.body.style.filter = 'hue-rotate(10deg) contrast(1.1)';
                setTimeout(() => {
                    document.body.style.filter = 'none';
                }, 100);
            }
        }, 3000);