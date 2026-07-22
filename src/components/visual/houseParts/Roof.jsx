export default function Roof({ frameOnly = false, ...props }) {
  const color = frameOnly ? "#f4c84a" : "#e66d4f";
  return <group position={[0, 2.62, 0]} {...props}>
    <mesh position={[-.56, 0, 0]} rotation={[0, 0, Math.PI / 5.4]}>
      <boxGeometry args={[1.86, frameOnly ? .1 : .28, 2.65]} />
      <meshStandardMaterial color={color} roughness={.7} />
    </mesh>
    <mesh position={[.56, 0, 0]} rotation={[0, 0, -Math.PI / 5.4]}>
      <boxGeometry args={[1.86, frameOnly ? .1 : .28, 2.65]} />
      <meshStandardMaterial color={color} roughness={.7} />
    </mesh>
  </group>;
}
