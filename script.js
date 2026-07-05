document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Scroll Progress & Navigation Dynamics (Apple Glass Effect)
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

        // Shrink and add shadow to navbar on scroll
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
            const triggerPoint = viewportHeight * 0.7; // Start animating line when section enters 70% of screen
            
            if (sectionTop < triggerPoint) {
                const distance = triggerPoint - sectionTop;
                const progressPercent = Math.min(Math.max((distance / (sectionHeight - 100)) * 100, 0), 100);
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
    handleScroll(); // Trigger once on load in case page is loaded scrolled down

    // ==========================================================================
    // 2. Mobile Full-Screen Menu Toggle
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
                mobileNavOverlay.classList.remove('remove');
                mobileNavOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // ==========================================================================
    // 3. Metric Counter Increments (Tick Animation)
    // ==========================================================================
    const startCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 1500; // Counter takes 1.5s to finish
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
    // 4. Scroll Reveal Intersection Observer
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
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
                
                // Unobserve since we only want to reveal once
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element fully enters
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ==========================================================================
    // 5. Skills Dashboard Console (Interactive Tabs)
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
            // Trigger animation frame delay so browser catches transition
            setTimeout(() => {
                bar.style.width = bar.dataset.width;
            }, 100);
        });
    };

    consoleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Toggle Tab States
            consoleTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Toggle Panel States
            consolePanels.forEach(panel => {
                panel.classList.remove('active');
                // Reset bars back to 0 so they re-animate when clicked
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
    // 6. Hacker Terminal Typwriter Mockup (Asynchronous Execution)
    // ==========================================================================
    const initTerminalTypewriter = () => {
        const terminal = document.getElementById('hero-terminal');
        if (!terminal) return;

        const terminalCommands = [
            { type: 'input', text: './initialize_adversary_sim.py --target local_subnet' },
            { type: 'info', text: '[i] Loading threat intelligence profiles...' },
            { type: 'info', text: '[i] Simulation mapping: MITRE ATT&CK Matrix' },
            { type: 'success', text: '[+] Active profiles: T1003 (Credential Dumping), T1021 (Remote Services)' },
            { type: 'input', text: 'run_kql_query --file detection_rule.kql' },
            { type: 'success', text: '[✔] Threat Identified: Anomalous LSASS Access detected. Alert triggered!' },
            { type: 'input', text: 'raven_agent --status' },
            { type: 'cyan', text: '[info] Raven AI Agent: Online. 5+ Bug Bounty vulnerabilities validated.' }
        ];

        terminal.innerHTML = ''; // Clear static markup

        let lineIdx = 0;

        const writeLine = () => {
            if (lineIdx >= terminalCommands.length) {
                // Add final blinking cursor line
                const promptLine = document.createElement('div');
                promptLine.className = 'terminal-line';
                promptLine.innerHTML = `<span class="t-cyan">$</span> <span class="cursor"></span>`;
                terminal.appendChild(promptLine);
                return;
            }

            const item = terminalCommands[lineIdx];
            const row = document.createElement('div');
            row.className = 'terminal-line';

            if (item.type === 'input') {
                row.innerHTML = `<span class="t-cyan">$</span> <span class="cmd-text"></span>`;
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
                        setTimeout(writeLine, 500); // Delay before next output line
                    }
                };
                typeCharacter();
            } else {
                if (item.type === 'info') row.className += ' t-yellow';
                else if (item.type === 'success') row.className += ' t-green';
                else if (item.type === 'cyan') row.className += ' t-cyan';

                row.textContent = item.text;
                terminal.appendChild(row);
                lineIdx++;
                setTimeout(writeLine, 250); // Small gap between prints
            }
            
            // Scroll to keep logs readable
            terminal.scrollTop = terminal.scrollHeight;
        };

        // Start typing loop after 800ms fade-in lag
        setTimeout(writeLine, 800);
    };

    initTerminalTypewriter();

    // ==========================================================================
    // 7. Interactive Canvas Particle Mesh Background (Fluid Dynamic Grid)
    // ==========================================================================
    const initCanvasMesh = () => {
        const canvas = document.getElementById('mesh-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let points = [];
        const mouse = { x: null, y: null, targetX: null, targetY: null, radius: 180 };

        // Mouse motion listener (feeds CSS custom variables and Javascript physics loop)
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
            // Node density: roughly one node per 9,000 square pixels
            const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 9000), 120);
            
            for (let i = 0; i < count; i++) {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                points.push({
                    x: x,
                    y: y,
                    originX: x,
                    originY: y,
                    vx: (Math.random() - 0.5) * 0.35,
                    vy: (Math.random() - 0.5) * 0.35,
                    easeX: x,
                    easeY: y,
                    color: Math.random() > 0.55 ? 'var(--accent-cyan)' : 'var(--accent-purple)',
                    radius: Math.random() * 1.5 + 0.8
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

            // Interpolate mouse movements for slick friction drag
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

            // Draw network link lines
            for (let i = 0; i < points.length; i++) {
                const p1 = points[i];
                for (let j = i + 1; j < points.length; j++) {
                    const p2 = points[j];
                    const dx = p1.easeX - p2.easeX;
                    const dy = p1.easeY - p2.easeY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 115) {
                        ctx.beginPath();
                        ctx.moveTo(p1.easeX, p1.easeY);
                        ctx.lineTo(p2.easeX, p2.easeY);
                        
                        // Dynamic opacity based on proximity
                        const alpha = ((115 - dist) / 115) * 0.06;
                        ctx.strokeStyle = p1.color === 'var(--accent-cyan)' 
                            ? `rgba(0, 243, 255, ${alpha})` 
                            : `rgba(157, 78, 221, ${alpha})`;
                        ctx.lineWidth = 0.45;
                        ctx.stroke();
                    }
                }
            }

            // Draw node particles
            points.forEach(p => {
                // Background drift
                p.originX += p.vx;
                p.originY += p.vy;

                // Bounce off boundaries
                if (p.originX < 0 || p.originX > window.innerWidth) p.vx *= -1;
                if (p.originY < 0 || p.originY > window.innerHeight) p.vy *= -1;

                let targetX = p.originX;
                let targetY = p.originY;

                // Local dynamic warp
                if (mouse.x !== null) {
                    const dx = p.originX - mouse.x;
                    const dy = p.originY - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        // Elastic repulsion force calculation
                        const force = (mouse.radius - dist) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        targetX = p.originX + Math.cos(angle) * force * 45;
                        targetY = p.originY + Math.sin(angle) * force * 45;
                    }
                }

                // Elastic drag interpolation
                p.easeX += (targetX - p.easeX) * 0.07;
                p.easeY += (targetY - p.easeY) * 0.07;

                // Render particle
                ctx.beginPath();
                ctx.arc(p.easeX, p.easeY, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color === 'var(--accent-cyan)' 
                    ? 'rgba(0, 243, 255, 0.45)' 
                    : 'rgba(157, 78, 221, 0.45)';
                ctx.fill();
            });

            requestAnimationFrame(drawMesh);
        };

        requestAnimationFrame(drawMesh);
    };

    initCanvasMesh();
});
