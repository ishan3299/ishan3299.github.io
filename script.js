document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Text Decryption / Scramble Animation System (Hacker Decrypt)
    // ==========================================================================
    class TextScrambler {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________0101';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 20);
                const end = start + Math.floor(Math.random() * 20);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span style="color:var(--accent-red);text-shadow:0 0 5px var(--accent-red);">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Initialize scramble triggers on navigation links (hover effect)
    document.querySelectorAll('.scramble-trigger').forEach(link => {
        const originalText = link.innerText;
        const scrambler = new TextScrambler(link);
        let isScrambling = false;

        link.addEventListener('mouseenter', () => {
            if (isScrambling) return;
            isScrambling = true;
            scrambler.setText(originalText).then(() => {
                isScrambling = false;
            });
        });
    });

    // ==========================================================================
    // 2. Scroll Progress & Navigation Dynamics (Red Team Glass)
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.querySelector('.scroll-progress');
    const experienceSection = document.querySelector('#experience');
    const timelineGlow = document.querySelector('.timeline-line-glow');
    const experienceBlocks = document.querySelectorAll('.experience-block');

    const handleScroll = () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // Update top scroll bar width
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + '%';
        }

        // Shrink navbar on scroll
        if (navbar) {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Timeline glow vertical height calculations
        if (experienceSection && timelineGlow) {
            const rect = experienceSection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const sectionTop = rect.top;
            
            const viewportHeight = window.innerHeight;
            const triggerPoint = viewportHeight * 0.7;
            
            if (sectionTop < triggerPoint) {
                const distance = triggerPoint - sectionTop;
                const progressPercent = Math.min(Math.max((distance / (sectionHeight - 120)) * 100, 0), 100);
                timelineGlow.style.height = progressPercent + '%';
            } else {
                timelineGlow.style.height = '0%';
            }
        }

        // Activate timeline block icons
        experienceBlocks.forEach(block => {
            const blockRect = block.getBoundingClientRect();
            if (blockRect.top < window.innerHeight * 0.65) {
                block.classList.add('active');
            } else {
                block.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // ==========================================================================
    // 3. Mobile Full-Screen Menu Toggle
    // ==========================================================================
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburgerBtn && mobileNavOverlay) {
        hamburgerBtn.addEventListener('click', () => {
            const isActive = hamburgerBtn.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
            
            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // ==========================================================================
    // 4. Metric Counter Increments (Tick Animation)
    // ==========================================================================
    const startCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 1500;
        const steps = 60;
        const stepTime = duration / steps;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = target + '+';
                clearInterval(timer);
            } else {
                el.innerText = Math.floor(current) + '+';
            }
        }, stepTime);
    };

    // ==========================================================================
    // 5. Scroll Reveal Intersection Observer & Text Decrypter
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it is a heading, run Decrypt Scrambler
                const title = entry.target.querySelector('.scramble-target');
                if (title) {
                    const originalText = title.innerText;
                    const scrambler = new TextScrambler(title);
                    scrambler.setText(originalText);
                }

                // If it is a bento metric card with counter, start tick animation
                const counter = entry.target.querySelector('.metric-number[data-target]');
                if (counter) {
                    startCounter(counter);
                }
                
                // If it contains the active skills console panel, trigger progress bars
                const activePanel = entry.target.querySelector('.console-panel.active');
                if (activePanel) {
                    animatePanelBars(activePanel);
                }
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // 6. Skills Console Tabs
    // ==========================================================================
    const consoleTabs = document.querySelectorAll('.console-tab');
    const consolePanels = document.querySelectorAll('.console-panel');

    // Store target widths from inline styling, then set initial widths to 0
    document.querySelectorAll('.progress-bar').forEach(bar => {
        const targetWidth = bar.style.width || '100%';
        bar.dataset.width = targetWidth;
        bar.style.width = '0%';
    });

    const animatePanelBars = (panel) => {
        const bars = panel.querySelectorAll('.progress-bar');
        bars.forEach(bar => {
            setTimeout(() => {
                bar.style.width = bar.dataset.width;
            }, 100);
        });
    };

    consoleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            consoleTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            consolePanels.forEach(panel => {
                panel.classList.remove('active');
                panel.querySelectorAll('.progress-bar').forEach(bar => {
                    bar.style.width = '0%';
                });
            });

            const activePanel = document.getElementById(`panel-${category}`);
            if (activePanel) {
                activePanel.classList.add('active');
                animatePanelBars(activePanel);
            }
        });
    });

    // ==========================================================================
    // 7. Tactical Metasploit-style Interactive Shell Simulator
    // ==========================================================================
    const initTerminalTypewriter = () => {
        const terminal = document.getElementById('hero-terminal');
        const hiddenInput = document.getElementById('terminal-input');
        const mockupContainer = document.querySelector('.terminal-mockup');
        if (!terminal || !hiddenInput || !mockupContainer) return;

        const terminalCommands = [
            { type: 'input', text: 'whoami' },
            { type: 'output', text: 'ishan (Standard user privileges)' },
            { type: 'input', text: './trendmicro_edr_killer.sh --exploit' },
            { type: 'info', text: '[*] Locating EDR user-mode service hooks...' },
            { type: 'info', text: '[*] Attempting unhooking technique via custom JMP instructions...' },
            { type: 'alert', text: '[!] Injecting bypass hook at offset 0x7FFF32C8...' },
            { type: 'success', text: '[✔] Success: Trend Micro EDR solution disabled successfully!' },
            { type: 'input', text: './gain_root.py --escalate' },
            { type: 'success', text: '[✔] Exploited local privilege escalation. Level: NT AUTHORITY\\SYSTEM' },
            { type: 'input', text: 'start_raven_agent --autonomous' },
            { type: 'purple', text: '[Raven] Active. Bypassed LLM safeguards. Executing bug bounty loop...' }
        ];

        terminal.innerHTML = ''; // Clear static markup
        let lineIdx = 0;

        const writeLine = () => {
            if (lineIdx >= terminalCommands.length) {
                // Initial script complete -> Enable Interactive CLI
                printLine('[i] Terminal interactive shell enabled.', 'info');
                printLine('Type "help" to display available red-team command operations.', 'info');
                setupInteractiveMode();
                return;
            }

            const item = terminalCommands[lineIdx];
            const row = document.createElement('div');
            row.className = 'terminal-line';

            if (item.type === 'input') {
                row.innerHTML = `<span class="t-red">#</span> <span class="cmd-text"></span>`;
                terminal.appendChild(row);
                const txtNode = row.querySelector('.cmd-text');

                let chIdx = 0;
                const typeCharacter = () => {
                    if (chIdx < item.text.length) {
                        txtNode.textContent += item.text.charAt(chIdx);
                        chIdx++;
                        setTimeout(typeCharacter, 25 + Math.random() * 30);
                    } else {
                        lineIdx++;
                        setTimeout(writeLine, 500);
                    }
                };
                typeCharacter();
            } else {
                if (item.type === 'info') row.className += ' t-yellow';
                else if (item.type === 'success') row.className += ' t-green';
                else if (item.type === 'alert') row.className += ' t-red';
                else if (item.type === 'purple') row.className += ' t-purple';

                row.textContent = item.text;
                terminal.appendChild(row);
                lineIdx++;
                setTimeout(writeLine, 250);
            }
            
            terminal.scrollTop = terminal.scrollHeight;
        };

        // Helper prints
        const printLine = (text, type = 'output') => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            if (type === 'info') line.className += ' t-yellow';
            else if (type === 'success') line.className += ' t-green';
            else if (type === 'alert') line.className += ' t-red';
            else if (type === 'purple') line.className += ' t-purple';
            line.textContent = text;
            terminal.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
        };

        // Set up events for manual typing
        const setupInteractiveMode = () => {
            let promptLine = document.createElement('div');
            promptLine.className = 'terminal-line input-prompt-line';
            promptLine.innerHTML = `<span class="t-red">#</span> <span class="typed-text"></span><span class="cursor"></span>`;
            terminal.appendChild(promptLine);
            terminal.scrollTop = terminal.scrollHeight;

            const typedTextEl = promptLine.querySelector('.typed-text');

            // Click focuses hidden text input
            mockupContainer.addEventListener('click', () => {
                hiddenInput.focus();
            });

            hiddenInput.addEventListener('focus', () => {
                mockupContainer.classList.add('focused');
            });

            hiddenInput.addEventListener('blur', () => {
                mockupContainer.classList.remove('focused');
            });

            // Handle typing inputs
            hiddenInput.addEventListener('input', (e) => {
                typedTextEl.textContent = e.target.value;
            });

            // Handle enters
            hiddenInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const rawCmd = hiddenInput.value.trim();
                    hiddenInput.value = '';
                    typedTextEl.textContent = '';
                    
                    // Remove input line temporarily, log command, then run processor
                    promptLine.remove();
                    printLine(rawCmd); // Prints command output as a static line
                    
                    if (rawCmd) {
                        processCommand(rawCmd.toLowerCase());
                    }
                    
                    // Re-append active input prompt line at the bottom
                    terminal.appendChild(promptLine);
                    terminal.scrollTop = terminal.scrollHeight;
                }
            });
        };

        // Interactive Command Router
        const processCommand = (cmd) => {
            switch (cmd) {
                case 'help':
                    printLine('Available Red-Team commands:', 'info');
                    printLine('  whoami       - Reveal active session operator details');
                    printLine('  bypass-edr   - Execute local unhooking memory vectors');
                    printLine('  list-ops     - List corporate campaign targets');
                    printLine('  run-raven    - Invoke autonomous API exploit daemon');
                    printLine('  clear        - Clear console output logs');
                    break;
                case 'whoami':
                    printLine('[+] NT AUTHORITY\\SYSTEM // Red Team Operator: Ishan Patel', 'success');
                    printLine('[+] Active campaigns: PwC Red Emulation Team // Gurugram', 'success');
                    break;
                case 'bypass-edr':
                    printLine('[*] Targeting local active security agents...', 'info');
                    printLine('[!] Memory segment manipulation initialized...', 'alert');
                    printLine('[!] Overwriting service entry hook JMP offsets...', 'alert');
                    printLine('[✔] Bypass payload injected. Target EDR disabled successfully!', 'success');
                    break;
                case 'list-ops':
                    printLine('Active GitHub & Laboratory Campaigns:', 'info');
                    printLine('  - AutoDetect Hub [sync:DAILY_RUNNER] [status:ACTIVE]', 'success');
                    printLine('  - Operation Raven [agent:AI_DAEMON] [status:MONITORING]', 'success');
                    printLine('  - Adversary Simulation Lab [status:DEPLOYED]', 'success');
                    break;
                case 'run-raven':
                    printLine('[*] Launching Raven autonomous exploit engine...', 'purple');
                    printLine('[Raven] Scanned target endpoints. Exposed route: /v2/debug/invoice_payload', 'purple');
                    printLine('[Raven] Exploit deployed: IDOR bypass query triggered.', 'alert');
                    printLine('[✔] Success: Exfiltrated root administrator database credentials.', 'success');
                    break;
                case 'clear':
                    terminal.innerHTML = '';
                    break;
                default:
                    printLine(`[-] command not found: ${cmd}. Type "help" for a list of operations.`, 'alert');
            }
        };

        setTimeout(writeLine, 800);
    };

    initTerminalTypewriter();

    // ==========================================================================
    // 8. Tactical Target Scanning Canvas (Radar Sweeper Mesh)
    // ==========================================================================
    const initCanvasMesh = () => {
        const canvas = document.getElementById('mesh-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let points = [];
        const mouse = { x: null, y: null, targetX: null, targetY: null, radius: 180 };
        let sweepAngle = 0;

        window.addEventListener('mousemove', (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        });

        window.addEventListener('mouseleave', () => {
            mouse.targetX = null;
            mouse.targetY = null;
        });

        const initPoints = () => {
            points = [];
            const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 10000), 100);
            
            const randomIP = () => `10.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*254)+1}`;
            
            for (let i = 0; i < count; i++) {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                points.push({
                    x: x,
                    y: y,
                    originX: x,
                    originY: y,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    easeX: x,
                    easeY: y,
                    radius: Math.random() * 1.5 + 0.8,
                    color: Math.random() > 0.6 ? 'var(--accent-red)' : 'var(--accent-purple)',
                    ip: randomIP(),
                    isHighlighted: false,
                    highlightTimer: 0
                });
            }
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initPoints();
        };

        window.addEventListener('resize', resize);
        resize();

        const drawMesh = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Interpolate mouse movements
            if (mouse.targetX !== null) {
                if (mouse.x === null) {
                    mouse.x = mouse.targetX;
                    mouse.y = mouse.targetY;
                } else {
                    mouse.x += (mouse.targetX - mouse.x) * 0.08;
                    mouse.y += (mouse.targetY - mouse.y) * 0.08;
                }
            } else {
                mouse.x = null;
                mouse.y = null;
            }

            // Radar scan logic
            sweepAngle += 0.01;
            const sweepRadius = 250;

            // Draw network lines
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                for (let j = i + 1; j < points.length; j++) {
                    const p2 = points[j];
                    const dx = p1.easeX - p2.easeX;
                    const dy = p1.easeY - p2.easeY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(p1.easeX, p1.easeY);
                        ctx.lineTo(p2.easeX, p2.easeY);
                        
                        let alpha = ((110 - dist) / 110) * 0.05;
                        if (p1.isHighlighted || p2.isHighlighted) {
                            alpha *= 2.5; // Double opacity if node is scanned
                        }
                        
                        ctx.strokeStyle = p1.color === 'var(--accent-red)' 
                            ? `rgba(255, 0, 60, ${alpha})` 
                            : `rgba(157, 78, 221, ${alpha})`;
                        ctx.lineWidth = p1.isHighlighted || p2.isHighlighted ? 0.6 : 0.4;
                        ctx.stroke();
                    }
                }
            }

            // Draw scanning sweep lines projecting from mouse
            if (mouse.x !== null) {
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, sweepRadius, sweepAngle, sweepAngle + 0.4);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.closePath();
                
                const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, sweepRadius);
                grad.addColorStop(0, 'rgba(255, 0, 60, 0.03)');
                grad.addColorStop(0.8, 'rgba(255, 0, 60, 0.01)');
                grad.addColorStop(1, 'transparent');
                
                ctx.fillStyle = grad;
                ctx.fill();
            }

            // Update & Draw nodes
            points.forEach(p => {
                p.originX += p.vx;
                p.originY += p.vy;

                if (p.originX < 0 || p.originX > window.innerWidth) p.vx *= -1;
                if (p.originY < 0 || p.originY > window.innerHeight) p.vy *= -1;

                let targetX = p.originX;
                let targetY = p.originY;

                // Repulsion warp from mouse
                if (mouse.x !== null) {
                    const dx = p.originX - mouse.x;
                    const dy = p.originY - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Check if node lies in sweep beam angle
                    const angleToNode = Math.atan2(dy, dx);
                    // Map angle to 0 - 2PI range
                    let diffAngle = angleToNode - (sweepAngle % (Math.PI * 2));
                    while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
                    while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;

                    if (dist < sweepRadius && Math.abs(diffAngle) < 0.2) {
                        p.isHighlighted = true;
                        p.highlightTimer = 50; // stays active for 50 frames
                    }

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        targetX = p.originX + Math.cos(angle) * force * 50;
                        targetY = p.originY + Math.sin(angle) * force * 50;
                    }
                }

                // Decay highlights
                if (p.highlightTimer > 0) {
                    p.highlightTimer--;
                } else {
                    p.isHighlighted = false;
                }

                // Easing coordinate changes
                p.easeX += (targetX - p.easeX) * 0.08;
                p.easeY += (targetY - p.easeY) * 0.08;

                // Render particle
                ctx.beginPath();
                ctx.arc(p.easeX, p.easeY, p.isHighlighted ? p.radius * 2 : p.radius, 0, Math.PI * 2);
                
                if (p.isHighlighted) {
                    ctx.fillStyle = 'var(--accent-red)';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = 'var(--accent-red)';
                    ctx.fill();
                    ctx.shadowBlur = 0; // reset shadow

                    // Print Target Metadata Label
                    ctx.font = '7.5px monospace';
                    ctx.fillStyle = 'rgba(255, 0, 60, 0.7)';
                    ctx.fillText(`[TARGET:${p.ip}]`, p.easeX + 8, p.easeY - 4);
                    ctx.fillStyle = 'rgba(0, 255, 102, 0.7)';
                    ctx.fillText(`[BYPASS:OK]`, p.easeX + 8, p.easeY + 5);
                } else {
                    ctx.fillStyle = p.color === 'var(--accent-red)' 
                        ? 'rgba(255, 0, 60, 0.4)' 
                        : 'rgba(157, 78, 221, 0.4)';
                    ctx.fill();
                }
            });

            requestAnimationFrame(drawMesh);
        };

        requestAnimationFrame(drawMesh);
    };

    initCanvasMesh();

    // ==========================================================================
    // 9. Moving Border card glows & Interactive Title Scramblers
    // ==========================================================================
    const initCardSpotlights = () => {
        const cards = document.querySelectorAll('.card, .bento-item, .achievement-card, .education-card');
        
        cards.forEach(card => {
            // Track mouse positions relative to cards
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--card-x', `${x}px`);
                card.style.setProperty('--card-y', `${y}px`);
            });

            // Set up text scramble on hovered card title
            const titleEl = card.querySelector('.scramble-hover');
            if (titleEl) {
                const originalText = titleEl.innerText;
                const scrambler = new TextScrambler(titleEl);
                let isScrambling = false;

                card.addEventListener('mouseenter', () => {
                    if (isScrambling) return;
                    isScrambling = true;
                    scrambler.setText(originalText).then(() => {
                        isScrambling = false;
                    });
                });
            }
        });
    };

    initCardSpotlights();
});
