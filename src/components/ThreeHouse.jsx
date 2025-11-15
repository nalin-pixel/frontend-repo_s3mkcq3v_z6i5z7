import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * ThreeHouse
 * - Loads a Blender-exported glTF/GLB model from /public/models/house.glb
 * - Plays a lightweight "assembly" animation on load (parts rise into place)
 * - Slowly dollies the camera toward the front door area
 * - No external state management; self-contained scene
 *
 * Export guidance (Blender → glTF):
 * - Apply transforms (Ctrl+A) and scale to meters (1 unit = 1m)
 * - File > Export > glTF 2.0 (.glb)
 *   • Format: GLB (Binary)
 *   • + Apply Modifiers, + Mesh: UVs
 *   • Materials: "Export" (use Principled BSDF)
 *   • + Compress with Draco (optional)
 * - Put file at public/models/house.glb (or update src prop)
 */
export default function ThreeHouse({ src = '/models/house.glb', onLoaded }) {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const controlsRef = useRef(null)
  const mixerRef = useRef(null)
  const clockRef = useRef(new THREE.Clock())

  useEffect(() => {
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f7fb)

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(6, 4, 8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.minDistance = 2
    controls.maxDistance = 20
    controls.target.set(0, 1.2, 0)

    // Lighting
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0)
    hemi.position.set(0, 20, 0)
    scene.add(hemi)

    const dir = new THREE.DirectionalLight(0xffffff, 1.2)
    dir.position.set(5, 10, 7)
    dir.castShadow = true
    scene.add(dir)

    // Ground (subtle)
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(50, 64),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.receiveShadow = true
    scene.add(ground)

    // Load model
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    loader.setDRACOLoader(dracoLoader)

    let model
    loader.load(
      src,
      (gltf) => {
        model = gltf.scene
        model.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true
            obj.receiveShadow = true
            // Assembly prep: store original position
            obj.userData.origPos = obj.position.clone()
            // Start slightly below to rise in
            obj.position.y -= Math.random() * 0.6 + 0.2
          }
        })
        scene.add(model)
        if (onLoaded) onLoaded()
      },
      undefined,
      (err) => {
        console.warn('Failed to load model:', err)
        if (onLoaded) onLoaded()
      }
    )

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer
    controlsRef.current = controls

    // Resize handling
    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // Animation loop
    let start = performance.now()
    const assembleDuration = 3000 // ms
    const dollyDuration = 3500 // ms

    const animate = () => {
      const dt = clockRef.current.getDelta()
      const t = performance.now() - start

      // Assembly animation
      if (model) {
        model.traverse((obj) => {
          if (obj.isMesh && obj.userData.origPos) {
            const progress = Math.min(t / assembleDuration, 1)
            const targetY = obj.userData.origPos.y
            const startY = targetY - 0.6
            obj.position.y = THREE.MathUtils.lerp(startY, targetY, easeOutCubic(progress))
          }
        })
      }

      // Camera dolly toward door/front area
      const camStart = new THREE.Vector3(6, 4, 8)
      const camEnd = new THREE.Vector3(2.2, 1.6, 3.2)
      const camProgress = Math.min(Math.max((t - assembleDuration * 0.3) / dollyDuration, 0), 1)
      camera.position.lerpVectors(camStart, camEnd, easeInOutQuad(camProgress))
      controls.target.lerp(new THREE.Vector3(0, 1.2, 0), 0.08)
      controls.update()

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', onResize)
      controls.dispose()
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.geometry?.dispose?.()
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.())
            else obj.material.dispose?.()
          }
        }
      })
    }
  }, [src, onLoaded])

  return <div ref={containerRef} className="w-full h-full" />
}

// Easing helpers
function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3)
}
function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}
