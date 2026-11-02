'use client';

import { Html, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import {
  CatmullRomCurve3,
  Mesh,
  MeshStandardMaterial,
  Vector3,
  type Group,
} from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

import type { Camp, Route } from '@/lib/schema';
import { formatAltitude } from '@/lib/format';
import { withBase } from '@/lib/withBase';

const CENTER_LAT = 27.995;
const CENTER_LNG = 86.92;
const MODEL_SIZE = 4.2;
const MODEL_HEIGHT = 1.8;
const BASE_ELEVATION = 5000;
const PEAK_ELEVATION = 8848.86;
const METERS_PER_DEG_LAT = 111_320;
const METERS_PER_DEG_LNG = 111_320 * Math.cos((CENTER_LAT * Math.PI) / 180);
const WORLD_WIDTH = (87.105 - 86.735) * METERS_PER_DEG_LNG;
const WORLD_DEPTH = (28.16 - 27.83) * METERS_PER_DEG_LAT;
const HORIZONTAL_SCALE = MODEL_SIZE / Math.max(WORLD_WIDTH, WORLD_DEPTH);

function project(lat: number, lng: number, altitude: number): Vector3 {
  return new Vector3(
    (lng - CENTER_LNG) * METERS_PER_DEG_LNG * HORIZONTAL_SCALE,
    ((altitude - BASE_ELEVATION) / (PEAK_ELEVATION - BASE_ELEVATION)) * MODEL_HEIGHT,
    -(lat - CENTER_LAT) * METERS_PER_DEG_LAT * HORIZONTAL_SCALE,
  );
}

function RouteRibbon({ route }: { route: Route }) {
  const geometry = useMemo(() => {
    const points = route.geometry.map((point) => project(point.lat, point.lng, point.alt));
    const curve = new CatmullRomCurve3(points, false, 'centripetal', 0.4);
    const segments = 180;
    const positions: number[] = [];
    const indices: number[] = [];
    const radius = 0.011;
    const sides = 6;

    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t).normalize();
      const normal = new Vector3(0, 1, 0);
      const binormal = new Vector3().crossVectors(tangent, normal).normalize();
      const up = new Vector3().crossVectors(binormal, tangent).normalize();

      for (let j = 0; j < sides; j += 1) {
        const angle = (j / sides) * Math.PI * 2;
        const offset = binormal
          .clone()
          .multiplyScalar(Math.cos(angle) * radius)
          .add(up.clone().multiplyScalar(Math.sin(angle) * radius));
        positions.push(point.x + offset.x, point.y + offset.y + 0.035, point.z + offset.z);
      }
    }

    for (let i = 0; i < segments; i += 1) {
      for (let j = 0; j < sides; j += 1) {
        const a = i * sides + j;
        const b = i * sides + ((j + 1) % sides);
        const c = (i + 1) * sides + j;
        const d = (i + 1) * sides + ((j + 1) % sides);
        indices.push(a, c, b, b, c, d);
      }
    }

    return { positions, indices };
  }, [route.geometry]);

  return (
    <mesh renderOrder={12}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[new Float32Array(geometry.positions), 3]}
        />
        <bufferAttribute attach="index" args={[new Uint32Array(geometry.indices), 1]} />
      </bufferGeometry>
      <meshStandardMaterial color="#1e293b" roughness={0.45} metalness={0.05} depthTest={false} />
    </mesh>
  );
}

function CampMarker({
  camp,
  active,
  onSelectCamp,
}: {
  camp: Camp;
  active: boolean;
  onSelectCamp: (campId: string) => void;
}) {
  const position = useMemo(() => project(camp.lat, camp.lng, camp.altitude), [camp]);

  return (
    <group position={position}>
      {active && (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <torusGeometry args={[0.075, 0.006, 8, 32]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
      )}
      <mesh
        renderOrder={13}
        position={[0, 0.035, 0]}
        onClick={(event) => {
          event.stopPropagation();
          onSelectCamp(camp.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[active ? 0.062 : 0.045, 20, 20]} />
        <meshStandardMaterial
          color={active ? '#1e293b' : camp.type === 'summit' ? '#334155' : '#94a3b8'}
          roughness={0.55}
          metalness={0.05}
          depthTest={false}
        />
      </mesh>
      {(active || camp.type === 'summit') && (
        <Html position={[0, camp.type === 'summit' ? 0.1 : 0.18, 0]} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
          <div className="scene-label">
            <span>{camp.type === 'summit' ? 'Эверест' : camp.shortName}</span>
            <strong>{formatAltitude(camp.altitude)} м</strong>
          </div>
        </Html>
      )}
    </group>
  );
}

function CameraRig({
  route,
  activeCampId,
}: {
  route: Route;
  activeCampId: string | null;
}) {
  const controls = useRef<OrbitControlsImpl>(null);
  const animating = useRef(false);
  const reduced = useReducedMotion();

  const desiredPosition = useRef(new Vector3(0.28, 1.52, 5.15));
  const desiredTarget = useRef(new Vector3(0, 0.9, 0));

  useEffect(() => {
    const camp = route.camps.find((item) => item.id === activeCampId);
    if (camp) {
      const point = project(camp.lat, camp.lng, camp.altitude);
      desiredTarget.current.set(point.x, point.y, point.z);
      desiredPosition.current.set(point.x + 1.5, point.y + 0.8, point.z + 1.9);
    } else {
      desiredTarget.current.set(0, 0.94, 0);
      desiredPosition.current.set(0.12, 1.5, 4.2);
    }
    animating.current = true;
  }, [activeCampId, route.camps]);

  useFrame(({ camera }, delta) => {
    if (!animating.current || !controls.current) return;
    const speed = reduced ? 60 : 4.2;
    const lerp = reduced ? 1 : 1 - Math.exp(-speed * delta);
    camera.position.lerp(desiredPosition.current, lerp);
    controls.current.target.lerp(desiredTarget.current, lerp);
    controls.current.update();
    if (
      camera.position.distanceTo(desiredPosition.current) < 0.015 &&
      controls.current.target.distanceTo(desiredTarget.current) < 0.01
    ) {
      animating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controls}
      target={[0, 0.94, 0]}
      enableDamping
      dampingFactor={0.07}
      minDistance={1.8}
      maxDistance={7.5}
      maxPolarAngle={Math.PI * 0.48}
      minPolarAngle={Math.PI * 0.12}
      onStart={() => {
        animating.current = false;
      }}
      makeDefault
    />
  );
}

function Terrain() {
  const gltf = useGLTF(withBase('/models/everest.glb'));
  const model = useMemo(() => {
    const cloned = gltf.scene.clone(true) as Group;
    cloned.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = new MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.88,
          metalness: 0.02,
        });
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return cloned;
  }, [gltf.scene]);

  return <primitive object={model} />;
}

function SceneContent({
  route,
  activeCampId,
  onSelectCamp,
}: {
  route: Route;
  activeCampId: string | null;
  onSelectCamp: (campId: string) => void;
}) {
  return (
    <>
      <color attach="background" args={['#eef2f6']} />
      <fog attach="fog" args={['#eef2f6', 7.5, 13]} />
      <ambientLight intensity={0.32} color="#f8fafc" />
      <hemisphereLight intensity={0.28} color="#ffffff" groundColor="#94a3b8" />
      <directionalLight position={[4.5, 6, 3.5]} intensity={1.15} color="#ffffff" />
      <directionalLight position={[-4, 2.5, -3]} intensity={0.25} color="#dbeafe" />

      <group rotation={[0, -0.04, 0]}>
        <Terrain />
        <RouteRibbon route={route} />
        {route.camps.map((camp) => (
          <CampMarker
            key={`${route.id}-${camp.id}`}
            camp={camp}
            active={camp.id === activeCampId}
            onSelectCamp={onSelectCamp}
          />
        ))}
      </group>

      <CameraRig route={route} activeCampId={activeCampId} />

    </>
  );
}

export default function MountainScene({
  route,
  activeCampId,
  onSelectCamp,
}: {
  route: Route;
  activeCampId: string | null;
  onSelectCamp: (campId: string) => void;
}) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0.28, 1.52, 5.15], fov: 33, near: 0.1, far: 30 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMappingExposure: 0.82 }}
      performance={{ min: 0.5 }}
    >
      <Suspense fallback={null}>
        <SceneContent route={route} activeCampId={activeCampId} onSelectCamp={onSelectCamp} />
      </Suspense>
    </Canvas>
  );
}
