export default function FrontDoor(props) {
  return <group position={[0, .55, -1.23]} {...props}>
    <mesh>
      <boxGeometry args={[.62, .95, .08]} />
      <meshStandardMaterial color="#1e6b45" roughness={.55} />
    </mesh>
    <mesh position={[.2, .02, -.06]}>
      <sphereGeometry args={[.045, 12, 12]} />
      <meshStandardMaterial color="#f4c84a" metalness={.2} roughness={.4} />
    </mesh>
    <mesh position={[0, .54, -.04]}>
      <boxGeometry args={[.52, .12, .05]} />
      <meshStandardMaterial color="#cfe4f7" />
    </mesh>
  </group>;
}
