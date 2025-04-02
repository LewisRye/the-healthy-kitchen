import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Grape(props) {
  const { nodes, materials } = useGLTF("models/Grape.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={materials["4CAF50"]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0_1.geometry}
        material={materials["4CAF50"]}
      />
    </group>
  );
}

useGLTF.preload("models/Grape.gltf");
