/* ===== Helpers ===== */
const $ = id => document.getElementById(id);
const canvas = $('fx'), ctx = canvas.getContext('2d');
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);

/* ===== Floating hearts & stars (background) ===== */
(function makeFloaters(){
  const box = $('floaters'), icons = ['💗','💖','💜','🌸'];
  for(let i=0;i<22;i++){
    const h = document.createElement('span');
    h.className = 'float';
    h.textContent = icons[i % icons.length];
    h.style.left = Math.random()*100 + '%';
    h.style.fontSize = (14 + Math.random()*22) + 'px';
    h.style.animationDuration = (9 + Math.random()*10) + 's';
    h.style.animationDelay = (-Math.random()*15) + 's';
    box.appendChild(h);
  }
  for(let i=0;i<30;i++){
    const s = document.createElement('span');
    s.className = 'star'; s.textContent = '✦';
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*100 + '%';
    s.style.fontSize = (8 + Math.random()*12) + 'px';
    s.style.animationDelay = (Math.random()*2) + 's';
    box.appendChild(s);
  }
})();

/* ===== Particle engine (confetti + fireworks share one canvas) ===== */
let parts = [], running = false;
function addConfetti(n = 140){
  const colors = ['#ff8fc7','#b79cff','#fff','#ffd36b','#7b4bd6'];
  for(let i=0;i<n;i++) parts.push({
    x: Math.random()*canvas.width, y: -10, vx: (Math.random()-.5)*4, vy: 2+Math.random()*4,
    g: .05, life: 220, size: 5+Math.random()*6, c: colors[i % colors.length], rect: true
  });
  loop();
}
function addFirework(x, y){
  const hue = Math.floor(Math.random()*360);
  for(let i=0;i<70;i++){
    const a = Math.random()*Math.PI*2, sp = 1+Math.random()*5;
    parts.push({ x, y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp, g: .06, life: 80,
      size: 2.5, c: `hsl(${hue},100%,70%)` });
  }
  loop();
}
function loop(){
  if(running) return; running = true;
  (function frame(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts = parts.filter(p => p.life-- > 0 && p.y < canvas.height + 20);
    for(const p of parts){
      p.vy += p.g; p.x += p.vx; p.y += p.vy;
      ctx.globalAlpha = Math.min(1, p.life/40);
      ctx.fillStyle = p.c;
      p.rect ? ctx.fillRect(p.x, p.y, p.size, p.size*.6)
             : (ctx.beginPath(), ctx.arc(p.x, p.y, p.size, 0, 7), ctx.fill());
    }
    if(parts.length) requestAnimationFrame(frame);
    else { running = false; ctx.clearRect(0,0,canvas.width,canvas.height); }
  })();
}

/* ===== Music (starts only after a click) ===== */
const music = $('music'), musicBtn = $('musicBtn');
musicBtn.onclick = () => {
  if(music.paused){ music.play().catch(()=>{}); musicBtn.classList.add('on'); musicBtn.textContent = '⏸'; }
  else { music.pause(); musicBtn.classList.remove('on'); musicBtn.textContent = '🎵'; }
};

/* ===== Landing -> main experience ===== */
$('openBtn').onclick = () => {
  $('main').hidden = false;
  musicBtn.hidden = false;
  $('landing').classList.add('leave');
  setTimeout(() => $('landing').remove(), 1000);
  addConfetti(120);
  musicBtn.click();               // user clicked, so audio is allowed
  animateTitle();
  new IntersectionObserver((e, o) => {   // type the letter when it scrolls into view
    if(e[0].isIntersecting){ typeLetter(); o.disconnect(); }
  }, {threshold:.4}).observe($('message'));
};

/* ===== Countdown to the next 12 November ===== */
function tick(){
  const now = new Date(), y = now.getFullYear();
  const today = now.getMonth() === 10 && now.getDate() === 12;
  const title = $('cdTitle');
  if(today){
    title.textContent = "It's your birthday today! 🎂";
    ['d','h','m','s'].forEach(k => $(k).textContent = 0);
    return;
  }
  let target = new Date(y, 10, 12);               // month 10 = November
  const justPassed = now > target;
  if(justPassed) target = new Date(y + 1, 10, 12); // next year's birthday
  title.textContent = justPassed ? "Hope your birthday was magical! Next one in..." : "Counting down to your special day...";
  const diff = target - now;
  $('d').textContent = Math.floor(diff/864e5);
  $('h').textContent = Math.floor(diff/36e5) % 24;
  $('m').textContent = Math.floor(diff/6e4) % 60;
  $('s').textContent = Math.floor(diff/1e3) % 60;
}
tick(); setInterval(tick, 1000);

/* ===== Animated heading (letter by letter) ===== */
function animateTitle(){
  const el = $('hbd'); el.textContent = '';
  [...'Happy Birthday, Dolly! 🎂'].forEach((ch, i) => {
    const s = document.createElement('span');
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    s.style.animationDelay = (i*0.07) + 's';
    el.appendChild(s);
  });
}
$('confettiBtn').onclick = () => { addConfetti(220); };

/* ===== Typing effect for the message ===== */
const letter = `Dear Damini, also known as Dolly and Harshita,

Some people make ordinary moments feel special just by being themselves. You are one of those rare people. Your beautiful smile, cute personality, and the happiness you bring make you truly special.

On your birthday, I wish you endless happiness, countless smiles, beautiful memories, and success in everything you dream of.

Never stop smiling, keep shining, and always stay the wonderful person you are.

Happy Birthday, Dolly! ❤️`;
function typeLetter(){
  const el = $('typed'); let i = 0; el.classList.add('typing');
  (function next(){
    el.textContent = letter.slice(0, ++i);
    if(i < letter.length) setTimeout(next, 28);
    else el.classList.remove('typing');
  })();
}

/* ===== Cake wish ===== */
$('wishBtn').onclick = () => {
  document.querySelector('.cake').classList.add('out');
  const m = $('wishMsg');
  m.textContent = 'May all your wishes come true, Dolly! ❤️';
  m.classList.add('show');
  addConfetti(100);
};

/* ===== Final fireworks ===== */
$('finalBtn').onclick = () => {
  addConfetti(200);
  let n = 0;
  const t = setInterval(() => {
    addFirework(canvas.width*(.15 + Math.random()*.7), canvas.height*(.15 + Math.random()*.4));
    if(++n > 14) clearInterval(t);
  }, 350);
};