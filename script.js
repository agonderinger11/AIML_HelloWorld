const canvas = document.getElementById('gradient-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let mouseX = 0.5;
let mouseY = 0.5;
let time = 0;

// Dark green code-themed palette - muted for dark background
const colors = [
    { r: 22, g: 163, b: 74 },    // Green 600
    { r: 5, g: 150, b: 105 },    // Emerald 600
    { r: 13, g: 148, b: 136 },   // Teal 600
    { r: 20, g: 184, b: 166 },   // Teal 400
    { r: 34, g: 197, b: 94 },    // Green 500
];

class Blob {
    constructor(index) {
        this.index = index;
        this.color = colors[index % colors.length];
        this.reset();
    }

    reset() {
        this.x = Math.random();
        this.y = Math.random();
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = 0;
        this.vy = 0;
        this.radius = 0.3 + Math.random() * 0.25;
        this.speed = 0.0004 + Math.random() * 0.0002;
        this.drift = 0.06 + Math.random() * 0.04;
        this.phaseX = Math.random() * Math.PI * 2;
        this.phaseY = Math.random() * Math.PI * 2;
        this.mass = 0.5 + Math.random() * 0.5;
    }

    applyForce(fx, fy) {
        this.vx += fx / this.mass;
        this.vy += fy / this.mass;
    }

    update(time, mouseInfluence) {
        // Apply velocity with friction
        const friction = 0.96;
        this.vx *= friction;
        this.vy *= friction;

        // Apply velocity to base position
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Smooth organic drifting motion
        const drift1 = Math.sin(time * this.speed + this.phaseX) * this.drift;
        const drift2 = Math.cos(time * this.speed * 0.7 + this.phaseY) * this.drift;

        this.x = this.baseX + drift1;
        this.y = this.baseY + drift2;

        // Gentle mouse attraction
        const dx = mouseInfluence.x - this.x;
        const dy = mouseInfluence.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.5 && dist > 0.01) {
            const force = (0.5 - dist) * 0.015;
            this.baseX += dx * force;
            this.baseY += dy * force;
        }

        // Wrap around edges
        if (this.baseX < -0.4) this.baseX += 1.8;
        if (this.baseX > 1.4) this.baseX -= 1.8;
        if (this.baseY < -0.4) this.baseY += 1.8;
        if (this.baseY > 1.4) this.baseY -= 1.8;
    }

    draw(ctx, width, height) {
        const x = this.x * width;
        const y = this.y * height;
        const r = this.radius * Math.min(width, height);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        // Very low opacity to prevent blowout
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.25)`);
        gradient.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.1)`);
        gradient.addColorStop(0.7, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.03)`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
}

const blobs = [];
for (let i = 0; i < 5; i++) {
    blobs.push(new Blob(i));
}

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / width;
    mouseY = e.clientY / height;
});

// Wind gust on click
function applyWindGust(clickX, clickY) {
    for (const blob of blobs) {
        const dx = blob.x - clickX;
        const dy = blob.y - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.001) continue;

        const maxDist = 1.0;
        const normalizedDist = Math.min(dist, maxDist) / maxDist;
        const forceMagnitude = (1 - normalizedDist) * 0.06;

        const forceX = (dx / dist) * forceMagnitude;
        const forceY = (dy / dist) * forceMagnitude;

        blob.applyForce(forceX, forceY);
    }
}

canvas.addEventListener('click', (e) => {
    applyWindGust(e.clientX / width, e.clientY / height);
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    applyWindGust(touch.clientX / width, touch.clientY / height);
}, { passive: false });

function animate() {
    time++;

    // CLEAR the canvas completely each frame - dark background
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, width, height);

    const mouseInfluence = { x: mouseX, y: mouseY };

    // NO blend mode - just normal source-over with low opacity blobs
    for (const blob of blobs) {
        blob.update(time, mouseInfluence);
        blob.draw(ctx, width, height);
    }

    requestAnimationFrame(animate);
}

animate();
