import './style.css'
import * as THREE from 'three'

const container = document.getElementById('scene')!

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
container.appendChild(renderer.domElement)

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight1 = new THREE.PointLight(0xe11d48, 2, 20)
pointLight1.position.set(5, 5, 5)
scene.add(pointLight1)

const pointLight2 = new THREE.PointLight(0x7c3aed, 1.5, 20)
pointLight2.position.set(-5, -3, 3)
scene.add(pointLight2)

const pointLight3 = new THREE.PointLight(0x3b82f6, 1, 15)
pointLight3.position.set(0, -5, 2)
scene.add(pointLight3)

// Main 3D object - torus knot
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32, 2, 3)
const material = new THREE.MeshStandardMaterial({
  color: 0x1a1a1a,
  metalness: 0.9,
  roughness: 0.1,
})

const torusKnot = new THREE.Mesh(geometry, material)
torusKnot.position.set(2.5, 0, 0)
scene.add(torusKnot)

// Wireframe version for depth
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0xe11d48,
  wireframe: true,
  transparent: true,
  opacity: 0.15,
})
const wireframe = new THREE.Mesh(geometry.clone(), wireframeMaterial)
wireframe.position.copy(torusKnot.position)
wireframe.scale.setScalar(1.02)
scene.add(wireframe)

// Mouse tracking
let mouseX = 0
let mouseY = 0
let targetRotationX = 0
let targetRotationY = 0

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2
})

// Touch support
document.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    mouseX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2
    mouseY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2
  }
})

function animate() {
  requestAnimationFrame(animate)

  // Smooth rotation following mouse
  targetRotationX += (mouseY * 0.5 - targetRotationX) * 0.05
  targetRotationY += (mouseX * 0.5 - targetRotationY) * 0.05

  // Base rotation + mouse influence
  const time = Date.now() * 0.0005
  torusKnot.rotation.x = time * 0.3 + targetRotationX
  torusKnot.rotation.y = time * 0.5 + targetRotationY

  wireframe.rotation.copy(torusKnot.rotation)

  // Subtle floating motion
  torusKnot.position.y = Math.sin(time * 2) * 0.15
  wireframe.position.y = torusKnot.position.y

  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)

  // Adjust position based on screen width
  if (window.innerWidth < 768) {
    torusKnot.position.set(0, 2, -1)
    wireframe.position.set(0, 2, -1)
    torusKnot.scale.setScalar(0.7)
    wireframe.scale.setScalar(0.7 * 1.02)
  } else {
    torusKnot.position.set(2.5, 0, 0)
    wireframe.position.set(2.5, 0, 0)
    torusKnot.scale.setScalar(1)
    wireframe.scale.setScalar(1.02)
  }
})

// Initial position check
if (window.innerWidth < 768) {
  torusKnot.position.set(0, 2, -1)
  wireframe.position.set(0, 2, -1)
  torusKnot.scale.setScalar(0.7)
  wireframe.scale.setScalar(0.7 * 1.02)
}

animate()
