import React from "react";

export function Room() {
  return (
    <>
      {/* Floor */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[50, 1, 50]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
      {/* Back Wall
      <mesh position={[0, 50, -50]} castShadow receiveShadow>
        <boxGeometry args={[100, 100, 1]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      Front Wall
      <mesh position={[0, 50, 50]} castShadow receiveShadow>
        <boxGeometry args={[100, 100, 1]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      Left Wall
      <mesh position={[-50, 50, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 100, 100]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
      Right Wall
      <mesh position={[50, 50, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 100, 100]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>*/}
    </>
  );
}
