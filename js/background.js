const background = document.getElementById('background');

document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const mouseXPercent = (mouseX / windowWidth) * 100;
    const mouseYPercent = (mouseY / windowHeight) * 100;
    
    background.style.setProperty('--mouse-x', mouseXPercent + '%');
    background.style.setProperty('--mouse-y', mouseYPercent + '%');
    
    
    background.classList.add('active');
});

document.addEventListener('mouseleave', () => {
    background.classList.remove('active');
});


document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const mouseX = touch.clientX;
    const mouseY = touch.clientY;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    
    const mouseXPercent = (mouseX / windowWidth) * 100;
    const mouseYPercent = (mouseY / windowHeight) * 100;
    
    
    background.style.setProperty('--mouse-x', mouseXPercent + '%');
    background.style.setProperty('--mouse-y', mouseYPercent + '%');
    
    
    background.classList.add('active');
});

document.addEventListener('touchend', () => {
    background.classList.remove('active');
});