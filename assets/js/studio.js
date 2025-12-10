// ======================================
// AI STUDIO JAVASCRIPT - studio.js
// 3D Canvas, Material Selector, Cost Simulator
// ======================================

// Material Data with enhanced properties
const materials = {
    cotton: { name: 'Cotton', cost: 120, color: '#F5F5DC', texture: 'soft', pattern: 'plain' },
    denim: { name: 'Denim', cost: 200, color: '#1560BD', texture: 'rough', pattern: 'twill' },
    silk: { name: 'Silk', cost: 450, color: '#E6E6FA', texture: 'smooth', pattern: 'satin' },
    leather: { name: 'Leather', cost: 650, color: '#8B4513', texture: 'textured', pattern: 'grain' },
    linen: { name: 'Linen', cost: 180, color: '#FAF0E6', texture: 'crisp', pattern: 'weave' },
    polyester: { name: 'Polyester', cost: 90, color: '#FFFFFF', texture: 'synthetic', pattern: 'plain' },
    velvet: { name: 'Velvet', cost: 380, color: '#800020', texture: 'plush', pattern: 'pile' },
    wool: { name: 'Wool', cost: 290, color: '#D3D3D3', texture: 'warm', pattern: 'knit' }
};

// Garment templates
const garmentTemplates = {
    dress: { name: 'Dress', geometry: 'dress', scale: [1.2, 2, 0.4], rotation: 0 },
    shirt: { name: 'Shirt', geometry: 'shirt', scale: [1.5, 1.2, 0.3], rotation: 0 },
    pants: { name: 'Pants', geometry: 'pants', scale: [0.8, 2, 0.5], rotation: 0 },
    jacket: { name: 'Jacket', geometry: 'jacket', scale: [1.6, 1.4, 0.5], rotation: 0 }
};

let selectedMaterial = null;
let selectedGarment = 'dress';
let scene, camera, renderer, mesh, particleSystem;
let isAutoRotate = true;
let mouseX = 0, mouseY = 0;

// Initialize Three.js Scene with Dynamic Effects
function initThreeJS() {
    const canvas = document.getElementById('threeCanvas');
    if (!canvas) return;

    // Scene setup with gradient background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 5, 15);

    // Camera
    camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer with enhanced settings
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvas.appendChild(renderer.domElement);

    // Enhanced Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.SpotLight(0xD4AF37, 1.5);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = true;
    keyLight.angle = Math.PI / 6;
    keyLight.penumbra = 0.3;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xF3E5C0, 0.8);
    fillLight.position.set(-5, 3, -3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xFFFFFF, 0.6);
    rimLight.position.set(0, -5, -5);
    scene.add(rimLight);

    // Create dynamic garment mesh
    createGarmentMesh(selectedGarment);

    // Add particle system for sparkle effect
    createParticleSystem();

    // Mouse interaction
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    canvas.addEventListener('click', () => {
        createExplosion();
    });

    // Animation loop with dynamic effects
    function animate() {
        requestAnimationFrame(animate);
        
        // Auto-rotation
        if (isAutoRotate && mesh) {
            mesh.rotation.y += 0.008;
            mesh.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
        }

        // Mouse tracking
        if (mesh && !isAutoRotate) {
            mesh.rotation.y += (mouseX * 0.5 - mesh.rotation.y) * 0.05;
            mesh.rotation.x += (mouseY * 0.3 - mesh.rotation.x) * 0.05;
        }

        // Animate particles
        if (particleSystem) {
            particleSystem.rotation.y += 0.001;
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 1; i < positions.length; i += 3) {
                positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.002;
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        // Animate lights
        keyLight.intensity = 1.5 + Math.sin(Date.now() * 0.002) * 0.3;
        fillLight.position.x = Math.sin(Date.now() * 0.001) * 5;

        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        if (canvas) {
            camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        }
    });
}

// Create dynamic garment mesh based on type
function createGarmentMesh(garmentType) {
    if (mesh) scene.remove(mesh);

    const template = garmentTemplates[garmentType];
    let geometry;

    // Create different geometries for different garments
    switch (garmentType) {
        case 'dress':
            geometry = new THREE.CylinderGeometry(0.5, 1.2, 3, 32);
            break;
        case 'shirt':
            geometry = new THREE.BoxGeometry(2.5, 2, 0.5);
            break;
        case 'pants':
            const group = new THREE.Group();
            const leg1 = new THREE.CylinderGeometry(0.3, 0.35, 2.5, 16);
            const leg2 = new THREE.CylinderGeometry(0.3, 0.35, 2.5, 16);
            const mesh1 = new THREE.Mesh(leg1);
            const mesh2 = new THREE.Mesh(leg2);
            mesh1.position.x = -0.4;
            mesh2.position.x = 0.4;
            group.add(mesh1);
            group.add(mesh2);
            geometry = group;
            break;
        case 'jacket':
            geometry = new THREE.BoxGeometry(2.8, 2.2, 0.6);
            break;
        default:
            geometry = new THREE.BoxGeometry(2, 3, 0.5);
    }

    const material = new THREE.MeshStandardMaterial({
        color: selectedMaterial ? materials[selectedMaterial].color : 0xD4AF37,
        metalness: 0.3,
        roughness: 0.4,
        emissive: 0x111111,
        emissiveIntensity: 0.2
    });

    if (garmentType === 'pants') {
        mesh = geometry;
        mesh.children.forEach(child => {
            child.material = material.clone();
        });
    } else {
        mesh = new THREE.Mesh(geometry, material);
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
}

// Create particle system for ambient effects
function createParticleSystem() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20
        );
        
        const color = new THREE.Color();
        color.setHSL(0.1 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.3);
        colors.push(color.r, color.g, color.b);
    }

    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

// Create explosion effect on click
function createExplosion() {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0xD4AF37,
        transparent: true,
        opacity: 1
    });

    for (let i = 0; i < 20; i++) {
        const particle = new THREE.Mesh(geometry, material.clone());
        particle.position.copy(mesh.position);
        
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );

        scene.add(particle);

        let opacity = 1;
        const animate = () => {
            particle.position.add(velocity);
            opacity -= 0.02;
            particle.material.opacity = opacity;
            particle.scale.multiplyScalar(0.95);

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                scene.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
            }
        };
        animate();
    }
    
    showToast('✨ Sparkle Effect!', 'success');
}

// Populate Material List
function loadMaterials() {
    const materialList = document.getElementById('materialList');
    if (!materialList) return;

    Object.keys(materials).forEach(key => {
        const mat = materials[key];
        const item = document.createElement('div');
        item.className = 'material-item';
        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong>${mat.name}</strong>
                    <div style="font-size: 0.9rem; color: rgba(255,255,255,0.6);">
                        R ${mat.cost}/meter
                    </div>
                </div>
                <div style="width: 30px; height: 30px; background: ${mat.color}; border-radius: 50%; border: 2px solid #D4AF37;"></div>
            </div>
        `;
        
        item.addEventListener('click', () => selectMaterial(key));
        materialList.appendChild(item);
    });
}

// Select Material with animation
function selectMaterial(materialKey) {
    selectedMaterial = materialKey;
    const mat = materials[materialKey];
    
    // Update UI
    document.getElementById('selectedMaterial').textContent = mat.name;
    document.getElementById('costPerMeter').textContent = `R ${mat.cost}`;
    
    // Update 3D mesh color with animation
    if (mesh) {
        const targetColor = new THREE.Color(mat.color);
        const currentColor = mesh.material ? mesh.material.color : new THREE.Color(0xD4AF37);
        
        let progress = 0;
        const animateColor = () => {
            progress += 0.05;
            if (progress <= 1) {
                if (mesh.material) {
                    mesh.material.color.lerpColors(currentColor, targetColor, progress);
                } else if (mesh.children) {
                    mesh.children.forEach(child => {
                        if (child.material) {
                            child.material.color.lerpColors(currentColor, targetColor, progress);
                        }
                    });
                }
                requestAnimationFrame(animateColor);
            }
        };
        animateColor();

        // Add scale pulse effect
        const originalScale = mesh.scale.clone();
        mesh.scale.multiplyScalar(1.2);
        setTimeout(() => {
            mesh.scale.copy(originalScale);
        }, 200);
    }
    
    // Highlight selected material
    document.querySelectorAll('.material-item').forEach(item => {
        item.style.borderColor = 'rgba(212, 175, 55, 0.2)';
        item.style.transform = 'scale(1)';
        item.style.boxShadow = 'none';
    });
    event.currentTarget.style.borderColor = '#D4AF37';
    event.currentTarget.style.transform = 'scale(1.05)';
    event.currentTarget.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.5)';
    
    showToast(`✨ ${mat.name} selected - ${mat.texture} texture`, 'success');
}

// Change garment type
function changeGarment(garmentType) {
    selectedGarment = garmentType;
    createGarmentMesh(garmentType);
    showToast(`Switched to ${garmentTemplates[garmentType].name}`, 'info');
}

// Calculate Cost
function calculateCost() {
    if (!selectedMaterial) {
        showToast('Please select a material first', 'error');
        return;
    }
    
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const costPerMeter = materials[selectedMaterial].cost;
    const total = quantity * costPerMeter;
    
    document.getElementById('totalCost').textContent = `R ${total.toFixed(2)}`;
    showToast(`Total cost calculated: R ${total.toFixed(2)}`, 'success');
}

// Control Buttons with enhanced interactions
function setupControls() {
    const rotateBtn = document.getElementById('rotateMesh');
    const resetBtn = document.getElementById('resetView');
    const calculateBtn = document.getElementById('calculateBtn');
    
    if (rotateBtn) {
        rotateBtn.addEventListener('click', () => {
            isAutoRotate = !isAutoRotate;
            rotateBtn.textContent = isAutoRotate ? 'Stop Rotation' : 'Auto Rotate';
            rotateBtn.classList.toggle('active');
            showToast(isAutoRotate ? '🔄 Auto-rotation enabled' : '⏸️ Rotation paused', 'info');
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (mesh) {
                // Smooth reset animation
                const targetRotation = { x: 0, y: 0, z: 0 };
                const targetCameraZ = 5;
                let progress = 0;
                
                const animate = () => {
                    progress += 0.05;
                    if (progress <= 1) {
                        mesh.rotation.x *= (1 - progress);
                        mesh.rotation.y *= (1 - progress);
                        mesh.rotation.z *= (1 - progress);
                        camera.position.z += (targetCameraZ - camera.position.z) * 0.1;
                        requestAnimationFrame(animate);
                    } else {
                        mesh.rotation.set(0, 0, 0);
                        camera.position.z = targetCameraZ;
                    }
                };
                animate();
                
                showToast('🎯 View reset to default', 'info');
            }
        });
    }
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCost);
    }

    // Add garment selector buttons
    addGarmentSelector();
}

// Add garment type selector
function addGarmentSelector() {
    const sidebar = document.querySelector('.studio-sidebar');
    if (!sidebar) return;

    const garmentPanel = document.createElement('div');
    garmentPanel.className = 'studio-panel glass-card';
    garmentPanel.innerHTML = `
        <h3 class="gold-text">Garment Type</h3>
        <div class="garment-selector">
            <button class="garment-btn active" data-garment="dress">👗 Dress</button>
            <button class="garment-btn" data-garment="shirt">👔 Shirt</button>
            <button class="garment-btn" data-garment="pants">👖 Pants</button>
            <button class="garment-btn" data-garment="jacket">🧥 Jacket</button>
        </div>
    `;

    sidebar.insertBefore(garmentPanel, sidebar.firstChild.nextSibling);

    // Add event listeners
    document.querySelectorAll('.garment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.garment-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            changeGarment(e.target.dataset.garment);
        });
    });
}

// Add CSS for new controls
const style = document.createElement('style');
style.textContent = `
    .garment-selector {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    .garment-btn {
        background: rgba(212, 175, 55, 0.2);
        border: 2px solid rgba(212, 175, 55, 0.4);
        color: #D4AF37;
        padding: 0.8rem;
        border-radius: 8px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .garment-btn:hover {
        background: rgba(212, 175, 55, 0.3);
        border-color: #D4AF37;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
    }

    .garment-btn.active {
        background: rgba(212, 175, 55, 0.5);
        border-color: #D4AF37;
        box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
    }

    .material-item {
        padding: 1rem;
        margin-bottom: 0.5rem;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(212, 175, 55, 0.2);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .material-item:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(212, 175, 55, 0.5);
        transform: translateX(5px);
    }

    .canvas-btn {
        transition: all 0.3s ease;
    }

    .canvas-btn.active {
        background: #D4AF37;
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
    }
`;
document.head.appendChild(style);

// Initialize on page load
if (document.getElementById('threeCanvas')) {
    window.addEventListener('load', () => {
        initThreeJS();
        loadMaterials();
        setupControls();
    });
}
