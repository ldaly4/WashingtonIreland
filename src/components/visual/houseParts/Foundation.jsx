export default function Foundation(props) {
  return <mesh position={[0, .08, 0]} {...props}>
    <boxGeometry args={[3.8, .16, 3]} />
    <meshStandardMaterial color="#d9d1c2" roughness={.8} />
  </mesh>;
}
