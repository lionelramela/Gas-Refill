import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw } from 'lucide-react';

interface Cylinder3DProps {
  color?: string; // e.g. '#2b395a' style navy or custom orange
  sizeScale?: number; // scale relative to standard 9kg
  heightScale?: number; // height relative to standard 9kg
  isRotating?: boolean;
}

export default function Cylinder3D({
  color = '#35476f',
  sizeScale = 1.0,
  heightScale = 1.0,
  isRotating = true,
}: Cylinder3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Keep references to update properties smoothly on changes
  const cylinderMeshRef = useRef<THREE.Group | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get size
    const container = containerRef.current;
    let width = container.clientWidth || 300;
    let height = container.clientHeight || 300;

    // Create scene with soft grey background to blend in
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.5);
    camera.lookAt(0, 0.2, 0);

    // Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (e) {
      console.error("WebGL context creation failed:", e);
      setHasError(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- Create Cylinder Model Design ---
    const cylinderGroup = new THREE.Group();

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.35,
      metalness: 0.25,
      bumpScale: 0.05,
    });
    materialRef.current = bodyMat;

    // Metallic material for welds, valve, collar details
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x8894a3,
      roughness: 0.2,
      metalness: 0.85,
    });
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xcca352,
      roughness: 0.15,
      metalness: 0.9,
    });
    const plasticMat = new THREE.MeshStandardMaterial({
      color: 0xff3300,
      roughness: 0.5,
      metalness: 0.1,
    });

    // Main Cylinder Parts Group
    const modelParts = new THREE.Group();

    // Base Dimensions
    const baseRadius = 0.85 * sizeScale;
    const bodyHeight = 1.9 * heightScale;

    // 1. The Main Cylindrical Body
    const bodyGeom = new THREE.CylinderGeometry(baseRadius, baseRadius, bodyHeight, 32, 1);
    const bodyMesh = new THREE.Mesh(bodyGeom, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyMesh.position.y = bodyHeight / 2;
    modelParts.add(bodyMesh);

    // 2. Spherical Top Dome
    const topDomeGeom = new THREE.SphereGeometry(baseRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const topDomeMesh = new THREE.Mesh(topDomeGeom, bodyMat);
    topDomeMesh.castShadow = true;
    topDomeMesh.receiveShadow = true;
    topDomeMesh.position.y = bodyHeight;
    modelParts.add(topDomeMesh);

    // 3. Spherical Bottom Dome (inverted)
    const botDomeGeom = new THREE.SphereGeometry(baseRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const botDomeMesh = new THREE.Mesh(botDomeGeom, bodyMat);
    botDomeMesh.castShadow = true;
    botDomeMesh.receiveShadow = true;
    botDomeMesh.rotation.x = Math.PI;
    botDomeMesh.position.y = 0;
    modelParts.add(botDomeMesh);

    // 4. Base supporting ring
    const baseRingGeom = new THREE.CylinderGeometry(baseRadius * 0.92, baseRadius * 0.92, 0.2, 32, 1, true);
    const baseRingMesh = new THREE.Mesh(baseRingGeom, steelMat);
    baseRingMesh.castShadow = true;
    baseRingMesh.position.y = -0.1;
    modelParts.add(baseRingMesh);

    // 5. Central Weld Ring (LPG cylinders typically have a prominent center-welded seam)
    const seamGeom = new THREE.TorusGeometry(baseRadius * 1.008, 0.025, 8, 32);
    const seamMesh = new THREE.Mesh(seamGeom, steelMat);
    seamMesh.rotation.x = Math.PI / 2;
    seamMesh.position.y = bodyHeight / 2;
    seamMesh.castShadow = true;
    modelParts.add(seamMesh);

    // 6. Top Protection Collar Handle
    const collarRadius = baseRadius * 0.65;
    const collarHeight = 0.45;
    const collarGeom = new THREE.CylinderGeometry(collarRadius, collarRadius, collarHeight, 24, 1, true);
    const collarMesh = new THREE.Mesh(collarGeom, bodyMat);
    collarMesh.position.y = bodyHeight + (baseRadius * 0.7);
    collarMesh.castShadow = true;
    collarMesh.receiveShadow = true;

    // Add handles to the collar by cutting out pieces, represented here by two steel handle bars
    const hBarGeom = new THREE.TorusGeometry(collarRadius, 0.04, 8, 16, Math.PI * 0.3);
    const hBarLeft = new THREE.Mesh(hBarGeom, steelMat);
    hBarLeft.position.y = bodyHeight + (baseRadius * 0.7) + 0.1;
    hBarLeft.rotation.z = Math.PI / 2;
    hBarLeft.rotation.x = Math.PI / 2;
    modelParts.add(hBarLeft);
    
    modelParts.add(collarMesh);

    // 7. Valve assembly on top
    const valveBaseGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.25, 12);
    const valveBase = new THREE.Mesh(valveBaseGeom, steelMat);
    valveBase.position.y = bodyHeight + (baseRadius * 0.5);
    modelParts.add(valveBase);

    const brassValveGeom = new THREE.CylinderGeometry(0.18, 0.1, 0.22, 12);
    const brassValve = new THREE.Mesh(brassValveGeom, brassMat);
    brassValve.position.y = bodyHeight + (baseRadius * 0.5) + 0.15;
    modelParts.add(brassValve);

    // Handwheel on top (Safety toggle)
    const wheelGeom = new THREE.TorusGeometry(0.15, 0.04, 8, 16);
    const wheelMesh = new THREE.Mesh(wheelGeom, plasticMat);
    wheelMesh.rotation.x = Math.PI / 2;
    wheelMesh.position.y = bodyHeight + (baseRadius * 0.5) + 0.28;
    modelParts.add(wheelMesh);

    // Place overall model parts inside the main rotating cylinder group
    cylinderGroup.add(modelParts);

    // Push down so rotation is centered
    const totalHeight = bodyHeight + (baseRadius * 0.7) + 0.28;
    modelParts.position.y = -totalHeight / 2 + 0.15;

    scene.add(cylinderGroup);
    cylinderMeshRef.current = cylinderGroup;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight1.position.set(5, 7, 5);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    dirLight1.shadow.bias = -0.001;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe5e9f0, 0.6);
    dirLight2.position.set(-5, 3, -5);
    scene.add(dirLight2);

    // Back rim spotlight for gorgeous glowing edges
    const rimLight = new THREE.SpotLight(0xff9e64, 2.5, 10, Math.PI * 0.3, 0.5, 1);
    rimLight.position.set(-3, 4, -4);
    scene.add(rimLight);

    // Add simple circular floor shadow to emphasize 3D
    const floorShadowGeom = new THREE.RingGeometry(0.01, baseRadius * 1.3, 30);
    const floorShadowMat = new THREE.MeshBasicMaterial({
      color: 0x070c14,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });
    const floorShadow = new THREE.Mesh(floorShadowGeom, floorShadowMat);
    floorShadow.rotation.x = Math.PI / 2;
    floorShadow.position.y = -(totalHeight / 2) + 0.13;
    scene.add(floorShadow);

    // --- Interactions / Drag to rotate ---
    let isMouseDown = false;
    let previousMouseX = 0;
    let targetRotationY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isMouseDown = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      previousMouseX = clientX;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - previousMouseX;
      targetRotationY += deltaX * 0.015;
      previousMouseX = clientX;
    };

    const onPointerUpOrLeave = () => {
      isMouseDown = false;
      setTimeout(() => setIsInteracting(false), 2000);
    };

    // Attach local event listeners to canvas container
    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    dom.addEventListener('mouseup', onPointerUpOrLeave);
    dom.addEventListener('mouseleave', onPointerUpOrLeave);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    dom.addEventListener('touchend', onPointerUpOrLeave);

    // --- Resize Observer ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        let { width: entryWidth, height: entryHeight } = entry.contentRect;
        // set values
        entryWidth = entryWidth || container.clientWidth || 300;
        entryHeight = entryHeight || container.clientHeight || 300;
        
        camera.aspect = entryWidth / entryHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(entryWidth, entryHeight);
      }
    });
    resizeObserver.observe(container);

    // --- Animation Loop ---
    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.01;

      if (cylinderGroup) {
        // Drag inertia
        cylinderGroup.rotation.y += (targetRotationY - cylinderGroup.rotation.y) * 0.15;

        // Auto rotation when the user is not drags & isRotating prop is true
        if (!isMouseDown && isRotating && !isInteracting) {
          cylinderGroup.rotation.y += 0.006;
          // Gentle vertical bobbing
          cylinderGroup.position.y = Math.sin(time * 1.5) * 0.08;
        } else if (isInteracting) {
          // Stay level during mouse interaction
          cylinderGroup.position.y += (0 - cylinderGroup.position.y) * 0.1;
        }

        // Slight hover lean effect
        const targetLeanZ = isHovered ? 0.08 : 0;
        cylinderGroup.rotation.z += (targetLeanZ - cylinderGroup.rotation.z) * 0.1;

        const targetLeanX = isHovered ? 0.05 : 0;
        cylinderGroup.rotation.x += (targetLeanX - cylinderGroup.rotation.x) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      dom.removeEventListener('mouseup', onPointerUpOrLeave);
      dom.removeEventListener('mouseleave', onPointerUpOrLeave);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      dom.removeEventListener('touchend', onPointerUpOrLeave);

      if (container.contains(dom)) {
        container.removeChild(dom);
      }

      // Dispose ThreeJS resources
      bodyGeom.dispose();
      topDomeGeom.dispose();
      botDomeGeom.dispose();
      baseRingGeom.dispose();
      seamGeom.dispose();
      collarGeom.dispose();
      hBarGeom.dispose();
      valveBaseGeom.dispose();
      brassValveGeom.dispose();
      wheelGeom.dispose();
      floorShadowGeom.dispose();

      bodyMat.dispose();
      steelMat.dispose();
      brassMat.dispose();
      plasticMat.dispose();
      floorShadowMat.dispose();

      renderer.dispose();
    };
  }, [color, sizeScale, heightScale, isRotating, isHovered, isInteracting]);

  // Handle color or scale change after mount dynamically if possible, or trigger re-render
  // Re-run the useEffect on color, scale change works flawlessly with the hook dependencies.

  if (hasError) {
    // Elegant fallback if WebGL is disabled or fails
    return (
      <div 
        className="w-full h-full flex flex-col items-center justify-center p-4 bg-navy-50/50 rounded-2xl border border-navy-100"
        id="gl-fallback-card"
      >
        <div className="w-24 h-40 bg-navy-200 rounded-3xl relative flex flex-col items-center shadow-lg border-t-8 border-navy-500">
          <div className="w-16 h-8 bg-navy-300 rounded-t-full mt-2 border-b-2 border-navy-400"></div>
          <div className="w-6 h-4 bg-amber-500 rounded mt-1"></div>
          <div className="absolute inset-y-0 flex items-center justify-center w-full">
            <span className="text-xs font-bold text-navy-800 tracking-wider">LPG GAS</span>
          </div>
          <div className="absolute bottom-2 bg-navy-800 text-white px-2 py-0.5 rounded text-[10px] font-mono">
            {sizeScale * 9}kg
          </div>
        </div>
        <p className="text-xs text-navy-500 mt-4 text-center">3D View limited on this system</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative cursor-grab active:cursor-grabbing group min-h-[280px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id="threejs-canvas-wrapper"
    >
      <div ref={containerRef} className="w-full h-full absolute inset-0" />
      
      {/* 3D Hint Badges */}
      <div className="absolute bottom-2 right-2 pointer-events-none flex items-center gap-1.5 bg-white/70 backdrop-blur-md px-2 py-1 rounded-full text-[10px] font-medium text-navy-900 shadow-sm border border-navy-100 transition-opacity opacity-80 group-hover:opacity-100">
        <RotateCcw className="w-3 h-3 text-gas-orange-500 animate-spin-slow" />
        <span>Drag to Rotate 3D Cylinder</span>
      </div>

      <div className="absolute top-2 left-2 pointer-events-none bg-gas-orange-500 text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded shadow-sm uppercase animate-pulse-slow">
        Interactive 3D Model
      </div>
    </div>
  );
}
