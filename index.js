const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader = document.getElementById('loader');
const loaderText = document.getElementById('loaderText');
const loaderSteps = ['Compile', 'Compiler Society', 'Best Society', 'Ready to Compile'];
const pagePlanets = [
    { id: 'home', label: 'Origin' },
    { id: 'mission', label: 'Mission' },
    { id: 'founders', label: 'Leadership' },
    { id: 'members', label: 'Members' },
    { id: 'projects', label: 'Projects' },
    { id: 'merch', label: 'Merch' },
    { id: 'join', label: 'Join' }
];

document.body.classList.add('is-loading');

loaderSteps.forEach((step, index) => {
    window.setTimeout(() => {
        loaderText.animate(
            [
                { opacity: 0, filter: 'blur(8px)', transform: 'translateY(10px) scale(0.98)' },
                { opacity: 1, filter: 'blur(0)', transform: 'translateY(0) scale(1)' }
            ],
            { duration: 420, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' }
        );
        loaderText.textContent = step;
    }, index * 2000);
});

window.setTimeout(() => {
    loader.classList.add('is-hidden');
    document.body.classList.remove('is-loading');
}, 8000);

window.setTimeout(() => {
    if (loader.parentElement) {
        loader.remove();
    }
}, 8900);

const navHeader = document.getElementById('navHeader');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const progressBar = document.getElementById('scrollProgress');
const planetLinks = Array.from(document.querySelectorAll('[data-planet-link]'));
const storyPanels = pagePlanets
    .map((planet) => document.getElementById(planet.id))
    .filter(Boolean);

function setActivePlanet(id) {
    planetLinks.forEach((link) => {
        link.classList.toggle('is-active', link.dataset.planetLink === id);
    });
}

function updateChrome() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    progressBar.style.transform = `scaleX(${progress})`;
    navHeader.classList.toggle('is-scrolled', window.scrollY > 24);

    const marker = window.scrollY + window.innerHeight * 0.48;
    const activePanel = storyPanels.reduce((current, panel) => {
        return Math.abs(panel.offsetTop - marker) < Math.abs(current.offsetTop - marker) ? panel : current;
    }, storyPanels[0]);
    if (activePanel) {
        setActivePlanet(activePanel.id);
    }
}

window.addEventListener('scroll', updateChrome, { passive: true });
window.addEventListener('resize', updateChrome);
updateChrome();

hamburger.addEventListener('click', () => {
    const isOpen = !navMenu.classList.contains('is-open');
    navMenu.classList.toggle('is-open', isOpen);
    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
});

navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

planetLinks.forEach((link) => {
    link.addEventListener('click', () => setActivePlanet(link.dataset.planetLink));
});

const joinForm = document.getElementById('joinForm');
joinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('emailInput').value.trim();
    if (!email || !email.includes('@')) {
        window.alert('Please enter a valid email address.');
        return;
    }
    window.alert('Application received. Welcome to the compile queue.');
});

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.story-panel').forEach((panel) => {
        const copy = panel.querySelector('.panel-copy');
        const supporting = panel.querySelectorAll('.story-caption, .metric-strip > div, .founder-grid article, .member-card, .project-shot, .join-form');

        gsap.fromTo(copy,
            { opacity: 0, y: 54, filter: 'blur(10px)' },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.95,
                ease: 'power3.out',
                scrollTrigger: { trigger: panel, start: 'top 68%', once: true }
            }
        );

        gsap.fromTo(supporting,
            { opacity: 0, y: 34, rotateX: -8 },
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                stagger: 0.07,
                duration: 0.75,
                ease: 'power3.out',
                scrollTrigger: { trigger: panel, start: 'top 58%', once: true }
            }
        );
    });
}

const canvas = document.getElementById('storyCanvas');

if (typeof THREE === 'undefined') {
    canvas.style.display = 'none';
} else {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 120);
    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0, 0.5, 13);

    const root = new THREE.Group();
    const orbitGroup = new THREE.Group();
    const cubeGroup = new THREE.Group();
    const networkGroup = new THREE.Group();
    const deployGroup = new THREE.Group();
    const galaxyGroup = new THREE.Group();
    const planetGroup = new THREE.Group();
    scene.add(root);
    root.add(orbitGroup, cubeGroup, networkGroup, deployGroup, planetGroup);
    scene.add(galaxyGroup);

    const planetConfigs = [
        { id: 'home', color: 0xffffff, size: 0.42, radius: 4.25, speed: 0.42 },
        { id: 'mission', color: 0xc9adff, size: 0.32, radius: 4.85, speed: 0.34 },
        { id: 'founders', color: 0x8d5cff, size: 0.48, radius: 5.3, speed: 0.29 },
        { id: 'members', color: 0xd9c9ff, size: 0.35, radius: 5.85, speed: 0.25 },
        { id: 'projects', color: 0x6f2cff, size: 0.44, radius: 6.25, speed: 0.22 },
        { id: 'join', color: 0xf4edff, size: 0.38, radius: 6.75, speed: 0.19 }
    ];
    const planetMeshes = [];

    scene.add(new THREE.AmbientLight(0xffffff, 0.74));

    const keyLight = new THREE.PointLight(0xb88cff, 90, 42);
    keyLight.position.set(-5, 6, 8);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x7c3cff, 70, 42);
    rimLight.position.set(6, -3, 6);
    scene.add(rimLight);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.24,
        metalness: 0.36,
        transmission: 0.1,
        emissive: 0x45149b,
        emissiveIntensity: 0.18
    });
    const edgeMaterial = new THREE.MeshBasicMaterial({
        color: 0xb88cff,
        transparent: true,
        opacity: 0.62,
        wireframe: true
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 2), coreMaterial);
    const coreWire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.95, 1), edgeMaterial);
    root.add(core, coreWire);

    const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xb88cff,
        transparent: true,
        opacity: 0.38
    });

    for (let i = 0; i < 3; i += 1) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.65 + i * 0.48, 0.012, 12, 160), ringMaterial.clone());
        ring.rotation.set(i * 0.85, i * 0.42, i * 0.62);
        orbitGroup.add(ring);
    }

    const nodeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.28,
        metalness: 0.15,
        emissive: 0x7c3cff,
        emissiveIntensity: 0.22
    });

    for (let i = 0; i < 5; i += 1) {
        const angle = (Math.PI * 2 * i) / 5;
        const node = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), nodeMaterial.clone());
        node.position.set(Math.cos(angle) * 3.25, Math.sin(angle) * 1.4, Math.sin(angle) * 2.2);
        orbitGroup.add(node);
    }

    planetConfigs.forEach((config, index) => {
        const material = new THREE.MeshPhysicalMaterial({
            color: config.color,
            roughness: 0.3,
            metalness: 0.28,
            emissive: config.color,
            emissiveIntensity: index === 0 ? 0.08 : 0.18
        });
        const planet = new THREE.Mesh(new THREE.SphereGeometry(config.size, 48, 48), material);
        planet.userData = { id: config.id, baseAngle: index * 1.05, radius: config.radius, speed: config.speed };

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(config.size * 1.18, 32, 32),
            new THREE.MeshBasicMaterial({
                color: config.color,
                transparent: true,
                opacity: 0.13,
                blending: THREE.AdditiveBlending
            })
        );
        atmosphere.userData = { isAtmosphere: true };
        planet.add(atmosphere);

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(config.size * 1.58, 0.008, 8, 96),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.22
            })
        );
        ring.rotation.x = Math.PI * 0.5;
        ring.userData = { isAtmosphere: true };
        planet.add(ring);

        planetGroup.add(planet);
        planetMeshes.push(planet);
    });

    const cubeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x7c3cff,
        roughness: 0.32,
        metalness: 0.55,
        emissive: 0x22004f,
        emissiveIntensity: 0.26
    });

    for (let i = 0; i < 18; i += 1) {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), cubeMaterial.clone());
        const angle = i * 0.75;
        const radius = 2.2 + (i % 4) * 0.38;
        cube.position.set(Math.cos(angle) * radius, (i - 9) * 0.16, Math.sin(angle) * radius);
        cube.rotation.set(angle, angle * 0.6, angle * 0.3);
        cubeGroup.add(cube);
    }

    const nodePositions = [];
    const networkMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < 28; i += 1) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const radius = 4.2 + Math.random() * 1.5;
        const position = new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi) * 0.72,
            radius * Math.sin(phi) * Math.sin(theta)
        );
        nodePositions.push(position);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), networkMaterial);
        dot.position.copy(position);
        networkGroup.add(dot);
    }

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xb88cff,
        transparent: true,
        opacity: 0.18
    });

    for (let i = 0; i < nodePositions.length - 1; i += 2) {
        const geometry = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[i + 1]]);
        networkGroup.add(new THREE.Line(geometry, lineMaterial));
    }

    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.26
    });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.75, 8, 48, 1, true), beamMaterial);
    beam.rotation.x = Math.PI / 2;
    deployGroup.add(beam);

    const platform = new THREE.Mesh(
        new THREE.TorusGeometry(1.7, 0.04, 16, 160),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.42 })
    );
    platform.position.z = -3.2;
    deployGroup.add(platform);

    const particleCount = 900;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 30;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
            color: 0xb88cff,
            size: 0.025,
            transparent: true,
            opacity: 0.62,
            depthWrite: false
        })
    );
    scene.add(particles);

    const galaxyCount = 1600;
    const galaxyPositions = new Float32Array(galaxyCount * 3);
    const galaxyColors = new Float32Array(galaxyCount * 3);
    const innerColor = new THREE.Color(0xffffff);
    const outerColor = new THREE.Color(0x7c3cff);

    for (let i = 0; i < galaxyCount; i += 1) {
        const radius = Math.random() * 9.5;
        const branchAngle = (i % 5) / 5 * Math.PI * 2;
        const spin = radius * 0.48;
        const scatter = Math.pow(Math.random(), 2.8) * 1.25;
        const randomX = (Math.random() < 0.5 ? -1 : 1) * scatter;
        const randomY = (Math.random() - 0.5) * scatter * 0.42;
        const randomZ = (Math.random() < 0.5 ? -1 : 1) * scatter;
        const mixed = innerColor.clone().lerp(outerColor, radius / 9.5);

        galaxyPositions[i * 3] = Math.cos(branchAngle + spin) * radius + randomX;
        galaxyPositions[i * 3 + 1] = randomY;
        galaxyPositions[i * 3 + 2] = Math.sin(branchAngle + spin) * radius + randomZ;
        galaxyColors[i * 3] = mixed.r;
        galaxyColors[i * 3 + 1] = mixed.g;
        galaxyColors[i * 3 + 2] = mixed.b;
    }

    const galaxyGeometry = new THREE.BufferGeometry();
    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(galaxyPositions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(galaxyColors, 3));
    const galaxy = new THREE.Points(
        galaxyGeometry,
        new THREE.PointsMaterial({
            size: 0.035,
            vertexColors: true,
            transparent: true,
            opacity: 0.72,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })
    );
    galaxyGroup.add(galaxy);

    const state = { scroll: 0, target: 0 };

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function segment(progress, start, end) {
        return clamp((progress - start) / (end - start), 0, 1);
    }

    function updateScrollTarget() {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        state.target = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    }

    function resizeRenderer() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    window.addEventListener('resize', resizeRenderer);
    updateScrollTarget();

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function updatePointer(event) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        return raycaster.intersectObjects(planetMeshes, true)
            .map((hit) => {
                let object = hit.object;
                while (object.parent && object.userData.isAtmosphere) {
                    object = object.parent;
                }
                return object;
            })
            .find((object) => object.userData.id);
    }

    canvas.addEventListener('pointermove', (event) => {
        canvas.style.cursor = updatePointer(event) ? 'pointer' : 'crosshair';
    });

    canvas.addEventListener('click', (event) => {
        const planet = updatePointer(event);
        if (!planet) {
            return;
        }
        const target = document.getElementById(planet.userData.id);
        if (target) {
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            setActivePlanet(planet.userData.id);
        }
    });

    function render(time = 0) {
        const t = time * 0.001;
        state.scroll += (state.target - state.scroll) * (reduceMotion ? 1 : 0.075);

        const p = state.scroll;
        const mission = segment(p, 0.08, 0.27);
        const leaders = segment(p, 0.24, 0.46);
        const members = segment(p, 0.42, 0.64);
        const project = segment(p, 0.6, 0.82);
        const join = segment(p, 0.78, 1);

        root.position.x = THREE.MathUtils.lerp(2.4, -2.25, p);
        root.position.y = Math.sin(p * Math.PI * 2) * 0.45;
        root.rotation.y = t * 0.22 + p * Math.PI * 2.4;
        root.rotation.x = Math.sin(t * 0.3) * 0.12 + p * 0.6;
        root.scale.setScalar(THREE.MathUtils.lerp(0.84, 1.22, mission) - members * 0.16 + join * 0.28);

        const activeIndex = Math.round(p * (planetMeshes.length - 1));
        planetMeshes.forEach((planet, index) => {
            const data = planet.userData;
            const angle = data.baseAngle + t * data.speed + p * Math.PI * (1.2 + index * 0.08);
            const focus = 1 - Math.min(1, Math.abs(activeIndex - index));
            const radius = data.radius - focus * 1.2;
            planet.position.set(
                Math.cos(angle) * radius,
                Math.sin(angle * 1.4) * (1.05 + focus * 0.35),
                Math.sin(angle) * radius * 0.58
            );
            planet.rotation.y += 0.006 + focus * 0.006;
            planet.rotation.x = Math.sin(t * 0.5 + index) * 0.16;
            planet.scale.setScalar(1 + focus * 0.72);
            planet.material.emissiveIntensity = 0.13 + focus * 0.42;
            planet.children.forEach((child) => {
                if (child.material) {
                    child.material.opacity = child.userData.isAtmosphere ? 0.12 + focus * 0.18 : child.material.opacity;
                }
            });
        });

        core.rotation.y = t * 0.52 + p * 5;
        core.rotation.x = t * 0.28 + p * 2.4;
        coreWire.rotation.y = -t * 0.38 - p * 4;
        coreWire.rotation.z = t * 0.24;

        orbitGroup.rotation.y = t * 0.35 + leaders * Math.PI * 2.1;
        orbitGroup.rotation.z = leaders * 0.8;
        orbitGroup.scale.setScalar(1 + leaders * 0.24);

        cubeGroup.children.forEach((cube, index) => {
            cube.rotation.x += 0.008 + mission * 0.01;
            cube.rotation.y += 0.012;
            cube.position.y += Math.sin(t + index) * 0.0015;
        });
        cubeGroup.rotation.y = -t * 0.18 - mission * Math.PI * 1.2;
        cubeGroup.scale.setScalar(0.7 + mission * 0.78);

        networkGroup.rotation.y = t * 0.12 + members * Math.PI * 1.8;
        networkGroup.rotation.x = members * 0.5;
        networkGroup.scale.setScalar(0.45 + members * 0.85);
        networkGroup.children.forEach((child) => {
            if (child.material) {
                child.material.opacity = child.type === 'Line' ? 0.08 + members * 0.26 : 0.2 + members * 0.75;
            }
        });

        deployGroup.rotation.z = t * 0.18 + project * Math.PI;
        deployGroup.position.z = THREE.MathUtils.lerp(-2.5, 1.2, project);
        deployGroup.scale.setScalar(0.35 + project * 1.2 + join * 0.3);
        beam.material.opacity = 0.04 + project * 0.32 + join * 0.18;
        platform.material.opacity = 0.12 + project * 0.35;

        particles.rotation.y = t * 0.025 + p * 0.8;
        particles.rotation.x = p * 0.18;
        particles.material.opacity = 0.34 + join * 0.32;

        galaxyGroup.rotation.y = t * 0.035 + p * Math.PI * 1.5;
        galaxyGroup.rotation.x = THREE.MathUtils.lerp(1.16, 0.42, mission) + members * 0.3 - join * 0.48;
        galaxyGroup.position.x = THREE.MathUtils.lerp(-1.5, 1.4, p);
        galaxyGroup.position.z = THREE.MathUtils.lerp(-4.5, -1.5, project);
        galaxyGroup.scale.setScalar(THREE.MathUtils.lerp(0.86, 1.26, mission) + project * 0.22);
        galaxy.material.opacity = 0.48 + mission * 0.24 + join * 0.24;

        camera.position.x = THREE.MathUtils.lerp(0, 1.8, p);
        camera.position.y = THREE.MathUtils.lerp(0.5, 1.2, project);
        camera.position.z = THREE.MathUtils.lerp(13, 10.5, p);
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
        window.requestAnimationFrame(render);
    }

    render();
}

// ============================================================
//  MERCH — Canvas jersey with live-updating text
// ============================================================
(function () {
    var canvas = document.getElementById('jerseyCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');

    // Internal drawing resolution (matches HTML width/height attrs)
    var CW = canvas.width;   // 280
    var CH = canvas.height;  // 420

    // Live state — defaults shown before user types
    var jerseyData = {
        name: 'YOUR NAME',
        number: '00',
        rank: 'MEMBER',
        showFront: true,
        frontImg: null,
        backImg: null,
        imagesReady: 0   // increments to 2 when both load
    };

    // ----------------------------------------------------------
    //  Drawing helpers
    // ----------------------------------------------------------
    function drawFront() {
        ctx.clearRect(0, 0, CW, CH);
        if (jerseyData.frontImg) {
            ctx.drawImage(jerseyData.frontImg, 0, 0, CW, CH);
        }
    }

    function drawBack() {
        ctx.clearRect(0, 0, CW, CH);
        if (jerseyData.backImg) {
            ctx.drawImage(jerseyData.backImg, 0, 0, CW, CH);
        }

        // ---- Text overlay ----
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Soft drop-shadow behind every text layer
        ctx.shadowColor = 'rgba(0, 15, 50, 0.85)';
        ctx.shadowBlur = 10;

        // 1. NAME  — bold Orbitron, auto-shrink if too long
        var nameTxt = jerseyData.name.toUpperCase();
        var nameFontSize = 26;
        ctx.font = 'bold ' + nameFontSize + 'px "Orbitron", monospace';
        var maxNameW = CW * 0.60;
        while (ctx.measureText(nameTxt).width > maxNameW && nameFontSize > 9) {
            nameFontSize -= 1;
            ctx.font = 'bold ' + nameFontSize + 'px "Orbitron", monospace';
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillText(nameTxt, CW * 0.50, CH * 0.255);   // ≈ y 107px on 420px canvas

        // 2. RANK  — smaller Inter
        ctx.font = '600 13px "Inter", sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.90)';
        ctx.fillText(jerseyData.rank, CW * 0.50, CH * 0.325);  // ≈ y 136px

        // 3. NUMBER  — giant bold Orbitron
        var numFontSize = 78;
        ctx.font = '900 ' + numFontSize + 'px "Orbitron", monospace';
        var numTxt = jerseyData.number || '00';
        // Shrink if two-digit number is still too wide (rare, but safe)
        while (ctx.measureText(numTxt).width > CW * 0.70 && numFontSize > 20) {
            numFontSize -= 2;
            ctx.font = '900 ' + numFontSize + 'px "Orbitron", monospace';
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillText(numTxt, CW * 0.50, CH * 0.468);    // ≈ y 197px

        ctx.restore();
    }

    function redraw() {
        if (jerseyData.showFront) {
            drawFront();
        } else {
            drawBack();
        }
    }

    // ----------------------------------------------------------
    //  Flip animation — CSS scaleX coin-flip technique
    //  Phase 1: ease-in collapse (scaleX → 0)  → swap image → redraw
    //  Phase 2: ease-out expand  (scaleX → 1)
    //  Both phases: 450 ms.  Dwell time between flips: 2800 ms.
    // ----------------------------------------------------------
    var flipBusy = false;
    var flipScheduler = null;

    function scheduleNextFlip(delay) {
        clearTimeout(flipScheduler);
        flipScheduler = setTimeout(startFlip, delay || 2800);
    }

    function startFlip() {
        if (flipBusy) return;
        flipBusy = true;

        // Phase 1 — collapse
        canvas.style.transition = 'transform 0.45s cubic-bezier(0.55, 0, 1, 0.45)';
        canvas.style.transform = 'scaleX(0)';

        setTimeout(function () {
            // Swap side + redraw at the invisible edge
            jerseyData.showFront = !jerseyData.showFront;
            redraw();

            // Phase 2 — expand
            canvas.style.transition = 'transform 0.45s cubic-bezier(0, 0.55, 0.45, 1)';
            canvas.style.transform = 'scaleX(1)';

            setTimeout(function () {
                flipBusy = false;
                scheduleNextFlip(2800);
            }, 450);
        }, 450);
    }

    // ----------------------------------------------------------
    //  Image loading
    // ----------------------------------------------------------
    function loadImg(src, onDone) {
        var img = new Image();
        img.onload = function () { onDone(img); };
        img.onerror = function () { onDone(null); };  // fail gracefully
        img.src = src;
    }

    loadImg('./Assets/front.png', function (img) {
        jerseyData.frontImg = img;
        jerseyData.imagesReady += 1;
        if (jerseyData.imagesReady === 2) { redraw(); scheduleNextFlip(2000); }
    });

    loadImg('./Assets/back.png', function (img) {
        jerseyData.backImg = img;
        jerseyData.imagesReady += 1;
        if (jerseyData.imagesReady === 2) { redraw(); scheduleNextFlip(2000); }
    });

    // ----------------------------------------------------------
    //  Input bindings — update state + redraw back if visible
    // ----------------------------------------------------------
    var nameEl   = document.getElementById('merchName');
    var numberEl = document.getElementById('merchNumber');
    var rankEl   = document.getElementById('merchRank');

    if (nameEl) {
        nameEl.addEventListener('input', function () {
            jerseyData.name = this.value.trim() || 'YOUR NAME';
            if (!jerseyData.showFront) redraw();
        });
    }

    if (numberEl) {
        numberEl.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 2);
            jerseyData.number = this.value || '00';
            if (!jerseyData.showFront) redraw();
        });
    }

    if (rankEl) {
        rankEl.addEventListener('input', function () {
            jerseyData.rank = this.value.trim() || 'MEMBER';
            if (!jerseyData.showFront) redraw();
        });
    }
})();
