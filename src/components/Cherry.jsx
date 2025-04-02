import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Cherry(props) {
  const { nodes, materials } = useGLTF("models/Cherry.gltf");
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0.geometry}
        material={materials.lambert9SG}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0_1.geometry}
        material={materials.lambert9SG}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.mesh_0_2.geometry}
        material={materials.lambert9SG}
      />
    </group>
  );
}

useGLTF.preload("models/Cherry.gltf");
