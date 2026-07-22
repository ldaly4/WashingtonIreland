function Window({ position, lit = false, onSelect }) {
  return <group position={position} onClick={onSelect}>
    <mesh position={[0, 0, -.02]}>
      <boxGeometry args={[.48, .42, .05]} />
      <meshStandardMaterial color={lit ? "#f4c84a" : "#cfe4f7"} emissive={lit ? "#f4c84a" : "#000"} emissiveIntensity={lit ? .4 : 0} />
    </mesh>
    <mesh position={[0, 0, -.055]}>
      <boxGeometry args={[.58, .52, .035]} />
      <meshStandardMaterial color="#10213f" />
    </mesh>
  </group>;
}

export default function Windows({ lit = false, onSelect }) {
  return <group>
    <Window position={[-.92, .92, -1.205]} lit={lit} onSelect={onSelect} />
    <Window position={[.92, .92, -1.205]} lit={lit} onSelect={onSelect} />
    <Window position={[-.58, 2.02, -1.055]} lit={lit} onSelect={onSelect} />
    <Window position={[.58, 2.02, -1.055]} lit={lit} onSelect={onSelect} />
  </group>;
}
