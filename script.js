document.addEventListener('DOMContentLoaded', function() {
    // Elementos globais
    const elements = {
        year: document.getElementById('year'),
        skills: document.querySelectorAll('.skill'),
        skillsSection: document.getElementById('habilidades'),
        contactForm: document.getElementById('contact-form'),
        navbar: document.getElementById('navbar'),
        themeSwitcher: document.getElementById('themeSwitcher'),
        themeIcon: document.querySelector('#themeSwitcher i'),
        textDisplay: document.getElementById('textDisplay'),
        textInput: document.getElementById('textInput'),
        wpmElement: document.getElementById('wpm'),
        accuracyElement: document.getElementById('accuracy'),
        timeElement: document.getElementById('time'),
        restartBtn: document.getElementById('restartBtn'),
        baseColorInput: document.getElementById('baseColor'),
        colorCountInput: document.getElementById('colorCount'),
        colorSchemeSelect: document.getElementById('colorScheme'),
        generateBtn: document.getElementById('generateBtn'),
        randomBtn: document.getElementById('randomBtn'),
        paletteContainer: document.getElementById('paletteContainer')
    };

    // Textos para o teste de digitação
    const sampleTexts = [
        "A prática leva à perfeição. Quanto mais você digita, mais rápido e preciso você se torna. A digitação é uma habilidade essencial no mundo digital de hoje.",
        "Desenvolvedores passam a maior parte do tempo lendo código ao invés de escrevendo. Escrever código limpo e legível é uma arte que todos devem buscar.",
        "JavaScript é a linguagem da web. Com ela você pode criar aplicações interativas e dinâmicas que rodam no navegador do usuário.",
        "Sorocaba é conhecida como a Manchester Paulista devido ao seu parque industrial diversificado e sua importância econômica para a região."
    ];

    // Estado da aplicação
    const state = {
        currentText: '',
        timer: null,
        timeLeft: 60,
        isTyping: false,
        startTime: 0,
        totalTyped: 0,
        correctTyped: 0
    };

    // Configuração inicial
    function init() {
        updateYear();
        setupSkillsAnimation();
        setupContactForm();
        setupSmoothScrolling();
        setupNavbarScrollEffect();
        setupThemeSwitcher();
        initTypingTest();
        initColorPaletteGenerator();
    }

    // Atualiza o ano no footer
    function updateYear() {
        elements.year.textContent = new Date().getFullYear();
    }

    // Animação das barras de habilidades
    function setupSkillsAnimation() {
        const animateSkills = () => {
            elements.skills.forEach(skill => {
                const level = skill.getAttribute('data-level');
                const skillLevel = skill.querySelector('.skill-level');
                skillLevel.style.width = level + '%';
            });
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(elements.skillsSection);
    }

    // Configura o formulário de contato
    function setupContactForm() {
        elements.contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(elements.contactForm);
            const data = Object.fromEntries(formData);
            
            try {
                // Simulação de envio (substitua por uma chamada real à API)
                console.log('Dados do formulário:', data);
                
                // Exemplo com fetch:
                // const response = await fetch('seu-endpoint', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify(data)
                // });
                // const result = await response.json();
                
                showNotification('Mensagem enviada com sucesso!', 'success');
                elements.contactForm.reset();
            } catch (error) {
                console.error('Erro:', error);
                showNotification('Ocorreu um erro ao enviar a mensagem.', 'error');
            }
        });
    }

    // Mostra notificação
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    // Configura rolagem suave
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Efeito na navbar ao rolar
    function setupNavbarScrollEffect() {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                elements.navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                elements.navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                elements.navbar.style.backgroundColor = 'white';
                elements.navbar.style.boxShadow = 'none';
            }
        });
    }

    // Alternador de tema
    function setupThemeSwitcher() {
        function getPreferredTheme() {
            const storedTheme = localStorage.getItem('theme');
            if (storedTheme) return storedTheme;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        function applyTheme(theme) {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark-mode');
                elements.themeIcon.classList.replace('fa-moon', 'fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark-mode');
                elements.themeIcon.classList.replace('fa-sun', 'fa-moon');
                localStorage.setItem('theme', 'light');
            }
        }

        function toggleTheme() {
            const currentTheme = localStorage.getItem('theme') || 
                               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        }

        // Observa mudanças no tema do sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });

        elements.themeSwitcher.addEventListener('click', toggleTheme);
        applyTheme(getPreferredTheme());
    }

    // Teste de digitação
    function initTypingTest() {
        loadNewText();
        elements.textInput.value = '';
        elements.textInput.focus();
        
        elements.textInput.addEventListener('input', checkTyping);
        elements.restartBtn.addEventListener('click', restartTest);
    }

    function loadNewText() {
        const randomIndex = Math.floor(Math.random() * sampleTexts.length);
        state.currentText = sampleTexts[randomIndex];
        displayText();
    }

    function displayText() {
        elements.textDisplay.innerHTML = '';
        state.currentText.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            elements.textDisplay.appendChild(charSpan);
        });
    }

    function checkTyping() {
        const typedArray = elements.textInput.value.split('');
        const textArray = state.currentText.split('');
        
        if (!state.isTyping) {
            startTest();
        }
        
        // Reset all spans
        const allSpans = elements.textDisplay.querySelectorAll('span');
        allSpans.forEach(span => span.className = '');
        
        // Update spans based on typing
        let correctCount = 0;
        typedArray.forEach((char, index) => {
            if (index < textArray.length) {
                if (char === textArray[index]) {
                    allSpans[index].classList.add('correct');
                    correctCount++;
                } else {
                    allSpans[index].classList.add('incorrect');
                }
            }
        });
        
        // Highlight current position
        if (typedArray.length < textArray.length) {
            allSpans[typedArray.length].classList.add('current');
        }
        
        // Update stats
        state.totalTyped = typedArray.length;
        state.correctTyped = correctCount;
        updateStats();
    }

    function startTest() {
        state.isTyping = true;
        state.startTime = Date.now();
        startTimer();
    }

    function startTimer() {
        clearInterval(state.timer);
        state.timeLeft = 60;
        elements.timeElement.textContent = state.timeLeft;
        
        state.timer = setInterval(() => {
            state.timeLeft--;
            elements.timeElement.textContent = state.timeLeft;
            
            if (state.timeLeft <= 0) {
                endTest();
            }
        }, 1000);
    }

    function updateStats() {
        // Calculate WPM (5 characters = 1 word)
        const timeElapsed = (Date.now() - state.startTime) / 60000; // in minutes
        const wpm = Math.round((state.correctTyped / 5) / timeElapsed) || 0;
        elements.wpmElement.textContent = wpm;
        
        // Calculate accuracy
        const accuracy = state.totalTyped > 0 ? Math.round((state.correctTyped / state.totalTyped) * 100) : 0;
        elements.accuracyElement.textContent = `${accuracy}%`;
    }

    function endTest() {
        clearInterval(state.timer);
        elements.textInput.disabled = true;
        state.isTyping = false;
        updateStats();
    }

    function restartTest() {
        clearInterval(state.timer);
        state.isTyping = false;
        state.timeLeft = 60;
        state.totalTyped = 0;
        state.correctTyped = 0;
        
        loadNewText();
        elements.textInput.value = '';
        elements.textInput.disabled = false;
        elements.textInput.focus();
        
        elements.wpmElement.textContent = '0';
        elements.accuracyElement.textContent = '0%';
        elements.timeElement.textContent = '60';
    }

    // Gerador de paleta de cores
    function initColorPaletteGenerator() {
        generatePalette();
        elements.generateBtn.addEventListener('click', generatePalette);
        elements.randomBtn.addEventListener('click', generateRandomPalette);
    }

    function generatePalette() {
        const baseColor = elements.baseColorInput.value;
        const colorCount = parseInt(elements.colorCountInput.value);
        const scheme = elements.colorSchemeSelect.value;
        
        const colors = generateColorScheme(baseColor, colorCount, scheme);
        displayPalette(colors);
    }

    function generateRandomPalette() {
        // Generate random hex color
        const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        elements.baseColorInput.value = randomColor;
        generatePalette();
    }

    function generateColorScheme(baseColor, count, scheme) {
        const colors = [];
        const baseHSL = hexToHSL(baseColor);
        
        switch(scheme) {
            case 'monochromatic':
                for (let i = 0; i < count; i++) {
                    const lightness = 90 - (i * (70 / count));
                    colors.push(hslToHex(baseHSL.h, baseHSL.s, lightness));
                }
                break;
                
            case 'analogous':
                for (let i = 0; i < count; i++) {
                    let hue = (baseHSL.h + (i * 30) - (count * 15)) % 360;
                    if (hue < 0) hue += 360;
                    colors.push(hslToHex(hue, baseHSL.s, baseHSL.l));
                }
                break;
                
            case 'complementary':
                for (let i = 0; i < count; i++) {
                    const hue = (baseHSL.h + (i * 180 / (count - 1))) % 360;
                    colors.push(hslToHex(hue, baseHSL.s, baseHSL.l));
                }
                break;
                
            case 'triadic':
                for (let i = 0; i < count; i++) {
                    const hue = (baseHSL.h + (i * 120)) % 360;
                    colors.push(hslToHex(hue, baseHSL.s, baseHSL.l));
                }
                break;
                
            case 'tetradic':
                for (let i = 0; i < count; i++) {
                    const hue = (baseHSL.h + (i * 90)) % 360;
                    colors.push(hslToHex(hue, baseHSL.s, baseHSL.l));
                }
                break;
                
            default:
                colors.push(baseColor);
        }
        
        return colors;
    }

    function displayPalette(colors) {
        elements.paletteContainer.innerHTML = '';
        
        colors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            colorBox.textContent = color.toUpperCase();
            
            colorBox.addEventListener('click', () => {
                navigator.clipboard.writeText(color).then(() => {
                    const originalText = colorBox.textContent;
                    colorBox.textContent = 'COPIADO!';
                    setTimeout(() => {
                        colorBox.textContent = originalText;
                    }, 1000);
                });
            });
            
            elements.paletteContainer.appendChild(colorBox);
        });
    }

    // Funções de conversão de cor
    function hexToHSL(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse r, g, b values
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else {
            throw new Error('Invalid HEX color');
        }
        
        // Convert to [0, 1] range
        r /= 255;
        g /= 255;
        b /= 255;
        
        // Find min and max
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    function hslToHex(h, s, l) {
        // Must be fractions of 1
        s /= 100;
        l /= 100;
        
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c/2;
        let r = 0, g = 0, b = 0;
        
        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        
        // Having obtained RGB, convert channels to hex
        r = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        g = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        b = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        
        return `#${r}${g}${b}`.toUpperCase();
    }

    // Inicializa a aplicação
    init();
});