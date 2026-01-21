const root = document.documentElement;
let mouseX = 50;
let mouseY = 50;
let currentX = 50;
let currentY = 50;
let isMouseMoving = false;
let mouseTimeout;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;
    isMouseMoving = true;

    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
});

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function animate() {
    currentX = lerp(currentX, mouseX, 0.08);
    currentY = lerp(currentY, mouseY, 0.08);

    root.style.setProperty('--mouse-x', `${currentX}%`);
    root.style.setProperty('--mouse-y', `${currentY}%`);

    requestAnimationFrame(animate);
}

animate();
