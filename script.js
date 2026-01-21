const canvas = document.getElementById('gradient-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let time = 0;
let growthProgress = 0;
let growing = true;
const growthSpeed = 0.003;
const shrinkSpeed = 0.004;

// Green fractal colors
const branchColor = { r: 34, g: 197, b: 94 };

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// Recursive fractal tree branch
function drawBranch(x, y, length, angle, depth, maxDepth, progress) {
    if (depth > maxDepth || length < 2) return;

    // Calculate how much of this depth level should be drawn
    const depthProgress = Math.max(0, Math.min(1, (progress * maxDepth - depth + 1)));
    if (depthProgress <= 0) return;

    const currentLength = length * depthProgress;

    // Calculate end point
    const endX = x + Math.cos(angle) * currentLength;
    const endY = y + Math.sin(angle) * currentLength;

    // Branch thickness decreases with depth
    const thickness = Math.max(1, (maxDepth - depth + 1) * 1.5);

    // Color gets lighter/more vibrant toward tips
    const depthRatio = depth / maxDepth;
    const r = branchColor.r + depthRatio * 40;
    const g = branchColor.g + depthRatio * 30;
    const b = branchColor.b + depthRatio * 20;
    const alpha = 0.9 - depthRatio * 0.3;

    // Draw the branch
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha * depthProgress})`;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Add glow effect on main branches
    if (depth < 4) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(${branchColor.r}, ${branchColor.g}, ${branchColor.b}, ${0.1 * depthProgress})`;
        ctx.lineWidth = thickness + 6;
        ctx.stroke();
    }

    // Only recurse if this branch is sufficiently drawn
    if (depthProgress > 0.3) {
        const newLength = length * 0.67;
        const branchAngle = 0.45 + Math.sin(depth * 0.5) * 0.1; // Slight variation

        // Left branch
        drawBranch(endX, endY, newLength, angle - branchAngle, depth + 1, maxDepth, progress);

        // Right branch
        drawBranch(endX, endY, newLength, angle + branchAngle, depth + 1, maxDepth, progress);

        // Sometimes add a middle branch for more complexity
        if (depth < 6 && depth % 2 === 0) {
            drawBranch(endX, endY, newLength * 0.8, angle, depth + 1, maxDepth, progress);
        }
    }
}

// Draw a complete fractal tree
function drawFractalTree(x, y, size, progress) {
    const maxDepth = 12;
    drawBranch(x, y, size, -Math.PI / 2, 0, maxDepth, progress);
}

function animate() {
    time++;

    // Update growth/shrink cycle
    if (growing) {
        growthProgress += growthSpeed;
        if (growthProgress >= 1) {
            growthProgress = 1;
            growing = false;
        }
    } else {
        growthProgress -= shrinkSpeed;
        if (growthProgress <= 0) {
            growthProgress = 0;
            growing = true;
        }
    }

    // Clear canvas
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, width, height);

    // Draw main fractal tree from bottom center
    const treeHeight = Math.min(width, height) * 0.35;
    drawFractalTree(width * 0.5, height * 0.95, treeHeight, growthProgress);

    // Draw smaller trees on sides (slightly delayed)
    const sideProgress = Math.max(0, growthProgress - 0.15) / 0.85;
    if (sideProgress > 0) {
        drawFractalTree(width * 0.15, height * 0.98, treeHeight * 0.5, sideProgress);
        drawFractalTree(width * 0.85, height * 0.98, treeHeight * 0.45, sideProgress * 0.9);
    }

    // Tiny background trees
    const bgProgress = Math.max(0, growthProgress - 0.3) / 0.7;
    if (bgProgress > 0) {
        drawFractalTree(width * 0.3, height * 0.99, treeHeight * 0.25, bgProgress * 0.7);
        drawFractalTree(width * 0.7, height * 0.99, treeHeight * 0.2, bgProgress * 0.6);
    }

    requestAnimationFrame(animate);
}

animate();
