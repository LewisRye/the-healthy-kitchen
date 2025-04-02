import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Environment, OrbitControls } from "@react-three/drei";
import { Grape } from "./Grape";

export const GrapeScene = ({ setScene }) => {
  return (
    <Canvas shadows camera={{ position: [0, 5, 150], fov: 90 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.7} />
      <Physics>
        <Environment preset="sunset" />
        <OrbitControls />
        <group position={[0, 0, 0]} scale={10}>
          <Grape onClick={() => setScene("home")} />
        </group>
      </Physics>
    </Canvas>
  );
};
