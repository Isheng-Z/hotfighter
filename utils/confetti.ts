
export const triggerFireworks = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Create a temporary canvas if we don't want to use a library, 
    // but for simplicity without external deps, we will create a simple DOM-based particle explosion
    // Or simpler: Just create confetti via creating elements.
    
    // Since we cannot install 'canvas-confetti' npm package in this environment easily without user action,
    // We will implement a lightweight vanilla JS particle system here.
    createParticles(window.innerWidth / 2, window.innerHeight / 2);
    createParticles(window.innerWidth / 3, window.innerHeight / 3);
    createParticles(2 * window.innerWidth / 3, window.innerHeight / 3);
  }, 250);
};

const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff'];

const createParticles = (x: number, y: number) => {
  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.width = '6px';
    el.style.height = '6px';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.borderRadius = '50%';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '9999';
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 4;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity;
    let life = 100;

    const animate = () => {
      life--;
      vy += 0.1; // gravity
      const left = parseFloat(el.style.left);
      const top = parseFloat(el.style.top);
      el.style.left = (left + vx) + 'px';
      el.style.top = (top + vy) + 'px';
      el.style.opacity = (life / 100).toString();

      if (life > 0) {
        requestAnimationFrame(animate);
      } else {
        el.remove();
      }
    };
    requestAnimationFrame(animate);
  }
};
