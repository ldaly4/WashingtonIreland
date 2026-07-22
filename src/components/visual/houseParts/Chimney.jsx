export default function Chimney(props) {
  return <group position={[1, 3.03, .35]} {...props}>
    <mesh>
      <boxGeometry args={[.36, .72, .38]} />
      <meshStandardMaterial color="#a94f3d" roughness={.78} />
    </mesh>
    <mesh position={[0, .4, 0]}>
      <boxGeometry args={[.44, .12, .46]} />
      <meshStandardMaterial color="#10213f" roughness={.75} />
    </mesh>
  </group>;
}
