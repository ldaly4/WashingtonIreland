export default function SolarPanels(props) {
  return <group position={[.52, 2.9, -.55]} rotation={[0, 0, -Math.PI / 5.4]} {...props}>
    <mesh>
      <boxGeometry args={[1.05, .08, .62]} />
      <meshStandardMaterial color="#10213f" roughness={.45} metalness={.1} />
    </mesh>
    {[-.28, 0, .28].map(x => <mesh key={x} position={[x, -.05, 0]}>
      <boxGeometry args={[.035, .03, .62]} />
      <meshStandardMaterial color="#8fc3ff" />
    </mesh>)}
  </group>;
}
