function Tree({ position }) {
  return <group position={position}>
    <mesh position={[0, .28, 0]}>
      <cylinderGeometry args={[.07, .09, .55, 8]} />
      <meshStandardMaterial color="#8a5a34" />
    </mesh>
    <mesh position={[0, .75, 0]}>
      <coneGeometry args={[.34, .72, 8]} />
      <meshStandardMaterial color="#1e6b45" roughness={.8} />
    </mesh>
  </group>;
}

export default function Garden({ showPath = true, onSelect }) {
  return <group onClick={onSelect}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.02, 0]}>
      <circleGeometry args={[3.7, 32]} />
      <meshStandardMaterial color="#dceccf" roughness={.9} />
    </mesh>
    {showPath && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .01, -1.95]}>
      <boxGeometry args={[.62, 1.95, .04]} />
      <meshStandardMaterial color="#f4c84a" roughness={.7} />
    </mesh>}
    <Tree position={[-2.35, 0, -.9]} />
    <Tree position={[2.28, 0, .82]} />
    <mesh position={[-1.9, .12, 1.3]}>
      <sphereGeometry args={[.22, 12, 8]} />
      <meshStandardMaterial color="#1e6b45" />
    </mesh>
  </group>;
}
