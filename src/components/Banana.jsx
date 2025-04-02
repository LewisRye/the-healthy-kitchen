import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Banana(props) {
  const { nodes, materials } = useGLTF("models/Banana.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={materials.blinn10SG}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0_1.geometry}
        material={materials.blinn10SG}
      />
    </group>
  );
}

useGLTF.preload("models/Banana.gltf");
