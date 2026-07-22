class ThreeScene {
  constructor() {
    this.container = document.getElementById('three-canvas-container');
    if (!this.container) return;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.init();
    this.animate();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.z = 150;

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color('#00f2fe');
    const color2 = new THREE.Color('#7000ff');

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Sphere distribution
      const r = 100 + Math.random() * 20;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      posArray[i] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i+1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i+2] = r * Math.cos(phi);

      // Mix colors based on position
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colorsArray[i] = mixedColor.r;
      colorsArray[i+1] = mixedColor.g;
      colorsArray[i+2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particlesMesh = new THREE.Points(geometry, material);
    this.scene.add(this.particlesMesh);

    // Grid Helper
    const gridHelper = new THREE.GridHelper(400, 40, 0x00f2fe, 0x7000ff);
    gridHelper.position.y = -80;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    this.scene.add(gridHelper);

    // Event listeners
    document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Scroll animation with GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      gsap.to(this.particlesMesh.rotation, {
        y: Math.PI * 2,
        x: Math.PI / 4,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
      
      gsap.to(this.camera.position, {
        z: 100,
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1
        }
      });
    }
  }

  onDocumentMouseMove(event) {
    this.mouseX = (event.clientX - this.windowHalfX) * 0.05;
    this.mouseY = (event.clientY - this.windowHalfY) * 0.05;
  }

  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    this.targetX = this.mouseX * 0.001;
    this.targetY = this.mouseY * 0.001;

    if (this.particlesMesh) {
      this.particlesMesh.rotation.y += 0.002 + (this.targetX - this.particlesMesh.rotation.y) * 0.05;
      this.particlesMesh.rotation.x += 0.001 + (this.targetY - this.particlesMesh.rotation.x) * 0.05;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  new ThreeScene();
});
