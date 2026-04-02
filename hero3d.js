import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('hero-canvas-container');
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    
    // Dynamic FOV and position for responsiveness
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.z = window.innerWidth < 768 ? 20 : 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- Resizing ---
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.position.z = window.innerWidth < 768 ? 20 : 12;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // --- Ambient & Environment Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(2, 6, 8);
    scene.add(dirLight);

    // --- The Liquid Glass Sweeping Catch Light ---
    const sweepLight = new THREE.PointLight(0xffffff, 100, 50); // Bright white catch light
    sweepLight.position.set(-15, 10, 8);
    scene.add(sweepLight);

    // --- Environment Map ---
    const rgbeLoader = new RGBELoader();
    // Using a bright standard environment map for high contrast refractions requested
    rgbeLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/equirectangular/royal_esplanade_1k.hdr', function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture; 
    });

    // --- Font Loader & Text Construction ---
    const loader = new FontLoader();
    // Using Helvetiker Bold as closest geometric modern sans available quickly with generic geometry
    loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json', function (font) {
        
        const geometry = new TextGeometry('Yashu', {
            font: font,
            size: window.innerWidth < 768 ? 2.8 : 3.5,
            depth: 0.6,
            curveSegments: 16,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.08,
            bevelOffset: 0.02,
            bevelSegments: 10
        });
        
        geometry.center();

        // --- Exact Apple Liquid Glass iOS 26 Material Requirements ---
        const glassMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transmission: 1.0,           // Core glass transmission
            opacity: 1.0,
            metalness: 0.0,              // Strict non-metallic dielectric
            roughness: 0.0,              // Perfectly smooth base
            ior: 1.5,                    // Standard generic glass IOR
            thickness: 1.2,              // Deep refractive optical volume
            dispersion: 1.0,             // Crucial native chromatic aberration in r160
            envMapIntensity: 1.6,        // Strong realistic reflections
            clearcoat: 1.0,              // Extra liquid top-layer shine
            clearcoatRoughness: 0.05,    // Sharp clearcoat
            iridescence: 1.0,            // Vision Pro style shimmer
            iridescenceIOR: 1.3,
            transparent: true,
            side: THREE.FrontSide        // Clean reflections
        });

        const textMesh = new THREE.Mesh(geometry, glassMaterial);
        scene.add(textMesh);

        // --- GSAP Premium Spring Animation Sequence ---
        // 1. Initial State completely off-screen, angled, scaled down
        textMesh.position.set(-18, 4, -8);
        textMesh.rotation.set(0.17, 0.31, 0); // ~10deg X, ~18deg Y
        textMesh.scale.set(0.3, 0.3, 0.3);

        const tl = gsap.timeline();

        // Hide HTML elements first
        gsap.set(".gsap-hero-reveal > *", { autoAlpha: 0, y: 20 });
        gsap.set(".gsap-hero-reveal", { autoAlpha: 1 });

        // 2. Physical Overshoot Spring Landing
        tl.to(textMesh.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2.0,
            ease: "back.out(1.2)"
        }, 0);

        tl.to(textMesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 2.0,
            ease: "back.out(1.2)"
        }, 0);

        tl.to(textMesh.rotation, {
            x: 0,
            y: 0,
            z: 0,
            duration: 2.2,
            ease: "back.out(1.2)"
        }, 0);

        // 3. iPhone / Vision Pro Specular Catch Light Sweep
        // Triggers precisely as the text locks into final position (around ~1.8s)
        tl.to(sweepLight.position, {
            x: 15,
            y: -10,
            duration: 1.2,
            ease: "power2.inOut"
        }, 1.8);

        // 4. Staggered reveal of hero text & buttons
        tl.to(".gsap-hero-reveal > *", {
            y: 0,
            autoAlpha: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out"
        }, 1.9); // Instantly following the text settlement

        // --- Internal Fluid & Idle Behavior ---
        let clock = new THREE.Clock();
        const initialThickness = 1.2;
        
        function render() {
            requestAnimationFrame(render);
            const time = clock.getElapsedTime();
            
            if (tl.progress() >= 1) { 
                // Subtle Apple-style liquid glass breathing
                textMesh.position.y = Math.sin(time * 1.5) * 0.08;
                textMesh.rotation.y = Math.sin(time * 0.6) * 0.03;
                textMesh.rotation.x = Math.sin(time * 0.9) * 0.015;
                
                // Micro caustics/refraction shift via thickness modulation
                glassMaterial.thickness = initialThickness + Math.sin(time * 2.0) * 0.2;
            }

            renderer.render(scene, camera);
        }
        
        render(); // Start rendering loop
    });
});
