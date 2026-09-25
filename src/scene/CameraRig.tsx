/**
 * 机位：默认娃娃屋视角；点选分区后缓动到该区的相对机位，复位则回到默认视角。
 * 缓动期间用户一拖动就立刻交还控制权，不做「抢镜头」。
 */

import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, type ComponentRef } from 'react'
import * as THREE from 'three'
import { DEFAULT_VIEW, ZONE_BY_KEY, zoneWorldCenter } from '../data/room'
import { useSceneState } from '../store/sceneStore'

const lerp = (a: number, b: number, k: number) => a + (b - a) * k

export function CameraRig() {
  const { selectedZone, resetToken } = useSceneState()
  const camera = useThree((s) => s.camera)
  const controls = useRef<ComponentRef<typeof OrbitControls> | null>(null)
  const want = useRef({
    pos: new THREE.Vector3(...DEFAULT_VIEW.position),
    target: new THREE.Vector3(...DEFAULT_VIEW.target),
  })
  const moving = useRef(false)

  useEffect(() => {
    if (!selectedZone) {
      want.current.pos.set(...DEFAULT_VIEW.position)
      want.current.target.set(...DEFAULT_VIEW.target)
    } else {
      const zone = ZONE_BY_KEY[selectedZone]
      const [wx, , wz] = zoneWorldCenter(selectedZone)
      want.current.pos.set(wx + zone.camOffset[0], zone.camOffset[1], wz + zone.camOffset[2])
      want.current.target.set(wx, 0.55, wz)
    }
    moving.current = true
  }, [selectedZone, resetToken])

  useEffect(() => {
    const c = controls.current
    if (!c) return
    const stop = () => {
      moving.current = false
    }
    c.addEventListener('start', stop)
    return () => c.removeEventListener('start', stop)
  }, [])

  useFrame((_, dt) => {
    const c = controls.current
    if (!c || !moving.current) return
    const k = 1 - Math.pow(0.0025, Math.min(dt, 0.05))
    camera.position.x = lerp(camera.position.x, want.current.pos.x, k)
    camera.position.y = lerp(camera.position.y, want.current.pos.y, k)
    camera.position.z = lerp(camera.position.z, want.current.pos.z, k)
    c.target.x = lerp(c.target.x, want.current.target.x, k)
    c.target.y = lerp(c.target.y, want.current.target.y, k)
    c.target.z = lerp(c.target.z, want.current.target.z, k)
    c.update()
    if (camera.position.distanceTo(want.current.pos) < 0.06) moving.current = false
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.09}
      rotateSpeed={0.75}
      zoomSpeed={0.8}
      minDistance={5}
      maxDistance={30}
      minPolarAngle={0.18}
      maxPolarAngle={Math.PI / 2.14}
      target={[...DEFAULT_VIEW.target]}
    />
  )
}
