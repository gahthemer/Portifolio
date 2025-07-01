// Scroll to top on page load
window.addEventListener('load', () => {
  window.scrollTo(0, 0);
  document.getElementById('inicio').scrollIntoView({ behavior: 'smooth' });
});

// Typing Effect for Name
const typingElement = document.querySelector('.typing');
const nameText = 'Gabriel Themer Brito';
let index = 0;

function typeName() {
  if (index < nameText.length) {
    typingElement.textContent += nameText.charAt(index);
    index++;
    setTimeout(typeName, 100);
  }
}
typeName();

// Matrix Effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) {
  drops[x] = 1;
}

function drawMatrix() {
  ctx.fillStyle = document.body.classList.contains('light-mode') ? 'rgba(240, 244, 245, 0.05)' : 'rgba(28, 37, 38, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = document.body.classList.contains('light-mode') ? '#4a5568' : '#00b894';
  ctx.font = fontSize + 'px Space Mono';

  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
    if (drops[i] * fontSize > canvas.height && Math.random() > 0.99) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(drawMatrix, 60); // Velocidade mais lenta para efeito sutil

window.addEventListener('resize', () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

// Theme Switcher
const themeSwitcher = document.getElementById('themeSwitcher');
themeSwitcher.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
});

// Circular Skill Progress Animation
document.querySelectorAll('.skill-circle').forEach(skill => {
  const level = skill.getAttribute('data-level');
  const circle = skill.querySelector('.progress-ring__circle');
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;
  setTimeout(() => {
    const offset = circumference - (level / 100) * circumference;
    circle.style.strokeDashoffset = offset;
  }, 500);
});

// Typing Test
const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timeDisplay = document.getElementById('time');
const restartBtn = document.getElementById('restartBtn');

const sampleTexts = [
  'A Matrix está em todos os lugares. É tudo o que nos cerca.',
  'Código é poesia, e eu sou o poeta.',
  'Hacker não é aquele que invade, mas aquele que cria.'
];

let currentText = '';
let startTime, timerInterval;

function startTypingTest() {
  currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  textDisplay.textContent = currentText;
  textInput.value = '';
  wpmDisplay.textContent = '0';
  accuracyDisplay.textContent = '0%';
  timeDisplay.textContent = '60';
  textInput.disabled = false;
  textInput.focus();

  let timeLeft = 60;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      textInput.disabled = true;
      calculateResults();
    }
  }, 1000);
}

function calculateResults() {
  const typedText = textInput.value;
  const words = typedText.split(' ').length;
  const correctChars = typedText.split('').filter((char, i) => char === currentText[i]).length;
  const accuracy = (correctChars / currentText.length * 100).toFixed(2);
  const wpm = Math.round(words / (60 - parseInt(timeDisplay.textContent)) * 60);
  wpmDisplay.textContent = wpm || 0;
  accuracyDisplay.textContent = accuracy + '%';
}

textInput.addEventListener('input', () => {
  if (!startTime) startTime = Date.now();
  if (textInput.value === currentText) {
    clearInterval(timerInterval);
    textInput.disabled = true;
    calculateResults();
  }
});

restartBtn.addEventListener('click', startTypingTest);
startTypingTest();

// Color Palette Generator
const baseColorInput = document.getElementById('baseColor');
const colorCountInput = document.getElementById('colorCount');
const colorSchemeSelect = document.getElementById('colorScheme');
const generateBtn = document.getElementById('generateBtn');
const randomBtn = document.getElementById('randomBtn');
const paletteContainer = document.getElementById('paletteContainer');

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
}

function generatePalette(baseColor, count, scheme) {
  const [r, g, b] = hexToRgb(baseColor);
  const colors = [baseColor];

  if (scheme === 'monochromatic') {
    for (let i = 1; i < count; i++) {
      const factor = 1 - (i * 0.1);
      colors.push(rgbToHex(r * factor, g * factor, b * factor));
    }
  } else if (scheme === 'analogous') {
    for (let i = 1; i < count; i++) {
      const hue = (i * 30) % 360;
      colors.push(rgbToHex((r + hue) % 255, (g + hue) % 255, (b + hue) % 255));
    }
  } else if (scheme === 'complementary') {
    colors.push(rgbToHex(255 - r, 255 - g, 255 - b));
    for (let i = 2; i < count; i++) {
      const factor = 1 - (i * 0.1);
      colors.push(rgbToHex((255 - r) * factor, (255 - g) * factor, (255 - b) * factor));
    }
  } else if (scheme === 'triadic') {
    colors.push(rgbToHex((r + 120) % 255, (g + 120) % 255, (b + 120) % 255));
    colors.push(rgbToHex((r + 240) % 255, (g + 240) % 255, (b + 240) % 255));
    for (let i = 3; i < count; i++) {
      const factor = 1 - (i * 0.1);
      colors.push(rgbToHex(r * factor, g * factor, b * factor));
    }
  } else if (scheme === 'tetradic') {
    colors.push(rgbToHex((r + 90) % 255, (g + 90) % 255, (b + 90) % 255));
    colors.push(rgbToHex((r + 180) % 255, (g + 180) % 255, (b + 180) % 255));
    colors.push(rgbToHex((r + 270) % 255, (g + 270) % 255, (b + 270) % 255));
    for (let i = 4; i < count; i++) {
      const factor = 1 - (i * 0.1);
      colors.push(rgbToHex(r * factor, g * factor, b * factor));
    }
  }

  paletteContainer.innerHTML = '';
  colors.slice(0, count).forEach(color => {
    const div = document.createElement('div');
    div.style.backgroundColor = color;
    div.textContent = color;
    paletteContainer.appendChild(div);
  });
}

generateBtn.addEventListener('click', () => {
  generatePalette(baseColorInput.value, parseInt(colorCountInput.value), colorSchemeSelect.value);
});

randomBtn.addEventListener('click', () => {
  const randomColor = rgbToHex(Math.random() * 255, Math.random() * 255, Math.random() * 255);
  baseColorInput.value = randomColor;
  generatePalette(randomColor, parseInt(colorCountInput.value), colorSchemeSelect.value);
});

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();