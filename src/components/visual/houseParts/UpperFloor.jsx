export default function UpperFloor(props) {
  return <mesh position={[0, 1.92, 0]} {...props}>
    <boxGeometry args={[2.75, 1.05, 2.05]} />
    <meshStandardMaterial color="#fffdf8" roughness={.65} />
  </mesh>;
}
