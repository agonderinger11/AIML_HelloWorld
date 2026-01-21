const canvas = document.getElementById('gradient-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let time = 0;
let growthProgress = 0;
const maxGrowth = 1;
const growthSpeed = 0.0008;

// Agave green palette
const leafColors = [
    { r: 34, g: 87, b: 46 },     // Dark green
    { r: 45, g: 106, b: 55 },    // Forest green
    { r: 56, g: 124, b: 68 },    // Medium green
    { r: 85, g: 140, b: 90 },    // Sage green
    { r: 107, g: 142, b: 95 },   // Dusty green
];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Draw a single agave leaf with pointed tip
function drawLeaf(cx, cy, angle, length, width, color, opacity) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.beginPath();
    ctx.moveTo(0, 0);

    // Left edge curve
    ctx.quadraticCurveTo(
        length * 0.3, -width * 0.5,
        length * 0.85, -width * 0.15
    );

    // Pointed tip
    ctx.lineTo(length, 0);

    // Right edge curve
    ctx.lineTo(length * 0.85, width * 0.15);
    ctx.quadraticCurveTo(
        length * 0.3, width * 0.5,
        0, 0
    );

    ctx.closePath();

    // Fill with gradient
    const gradient = ctx.createLinearGradient(0, 0, length, 0);
    gradient.addColorStop(0, `rgba(${color.r + 20}, ${color.g + 20}, ${color.b + 10}, ${opacity})`);
    gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`);
    gradient.addColorStop(1, `rgba(${color.r - 15}, ${color.g - 10}, ${color.b - 10}, ${opacity * 0.8})`);

    ctx.fillStyle = gradient;
    ctx.fill();

    // Subtle center line
    ctx.beginPath();
    ctx.moveTo(length * 0.1, 0);
    ctx.lineTo(length * 0.9, 0);
    ctx.strokeStyle = `rgba(${color.r + 30}, ${color.g + 30}, ${color.b + 20}, ${opacity * 0.3})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
}

// Draw complete agave rosette
function drawAgave(cx, cy, scale, progress) {
    const numLeaves = 21;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees

    // Draw leaves from outside in (so inner leaves overlap outer)
    for (let i = numLeaves - 1; i >= 0; i--) {
        const leafProgress = Math.max(0, Math.min(1, (progress * numLeaves - (numLeaves - 1 - i)) / 2));

        if (leafProgress <= 0) continue;

        const angle = i * goldenAngle - Math.PI / 2;
        const layerRatio = i / numLeaves;

        // Outer leaves are longer and wider
        const baseLength = scale * (0.4 + layerRatio * 0.6);
        const length = baseLength * leafProgress;
        const leafWidth = scale * (0.08 + layerRatio * 0.06) * leafProgress;

        // Leaves curve outward slightly
        const curveAngle = angle + (1 - layerRatio) * 0.15;

        const color = leafColors[i % leafColors.length];
        const opacity = 0.7 + layerRatio * 0.3;

        drawLeaf(cx, cy, curveAngle, length, leafWidth, color, opacity * leafProgress);
    }
}

// Draw multiple agaves at different positions
function drawScene() {
    // Clear canvas
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, width, height);

    // Main center agave (grows from center-bottom area)
    const mainScale = Math.min(width, height) * 0.4;
    drawAgave(width * 0.5, height * 0.75, mainScale, growthProgress);

    // Smaller side agaves (appear later)
    const sideProgress = Math.max(0, (growthProgress - 0.3) / 0.7);

    if (sideProgress > 0) {
        const sideScale = mainScale * 0.5;
        drawAgave(width * 0.15, height * 0.85, sideScale, sideProgress * 0.8);
        drawAgave(width * 0.85, height * 0.88, sideScale * 0.7, sideProgress * 0.6);
    }

    // Even smaller background agaves
    const bgProgress = Math.max(0, (growthProgress - 0.5) / 0.5);
    if (bgProgress > 0) {
        const bgScale = mainScale * 0.25;
        drawAgave(width * 0.08, height * 0.65, bgScale, bgProgress * 0.5);
        drawAgave(width * 0.92, height * 0.6, bgScale * 0.8, bgProgress * 0.4);
    }
}

function animate() {
    time++;

    // Grow the fractals
    if (growthProgress < maxGrowth) {
        growthProgress += growthSpeed;
        if (growthProgress > maxGrowth) growthProgress = maxGrowth;
    }

    // Add subtle breathing animation once grown
    const breathe = growthProgress >= maxGrowth ? Math.sin(time * 0.01) * 0.02 : 0;
    const displayProgress = growthProgress + breathe;

    // Clear and draw
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, width, height);

    // Main center agave
    const mainScale = Math.min(width, height) * 0.4;
    drawAgave(width * 0.5, height * 0.75, mainScale, displayProgress);

    // Side agaves
    const sideProgress = Math.max(0, (displayProgress - 0.3) / 0.7);
    if (sideProgress > 0) {
        const sideScale = mainScale * 0.5;
        drawAgave(width * 0.15, height * 0.85, sideScale, sideProgress * 0.8);
        drawAgave(width * 0.85, height * 0.88, sideScale * 0.7, sideProgress * 0.6);
    }

    // Background agaves
    const bgProgress = Math.max(0, (displayProgress - 0.5) / 0.5);
    if (bgProgress > 0) {
        const bgScale = mainScale * 0.25;
        drawAgave(width * 0.08, height * 0.65, bgScale, bgProgress * 0.5);
        drawAgave(width * 0.92, height * 0.6, bgScale * 0.8, bgProgress * 0.4);
    }

    requestAnimationFrame(animate);
}

// Click to reset growth animation
canvas.addEventListener('click', () => {
    growthProgress = 0;
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    growthProgress = 0;
}, { passive: false });

animate();
