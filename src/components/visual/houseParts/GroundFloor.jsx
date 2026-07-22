export default function GroundFloor(props) {
  return <mesh position={[0, .78, 0]} {...props}>
    <boxGeometry args={[3.2, 1.35, 2.35]} />
    <meshStandardMaterial color="#fbfaf2" roughness={.65} />
  </mesh>;
}
