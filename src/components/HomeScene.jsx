import { Canvas, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Environment, OrbitControls } from "@react-three/drei";
import { Banana } from "./Banana";
import { Cherry } from "./Cherry";
import { Grape } from "./Grape";
import { Room } from "./Room";

export const HomeScene = ({ setScene }) => {
  return (
    <Canvas shadows camera={{ position: [0, 15, 10], fov: 90 }}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 50, 50]} intensity={0.25} castShadow />
      <Physics>
        <Environment preset="sunset" />
        <Room />
        <OrbitControls />
        <group position={[0, 5, 0]} scale={0.05}>
          <Banana onClick={() => setScene("banana")} />
        </group>
        <group position={[0, 5, 0]} scale={1}>
          <Cherry onClick={() => setScene("cherry")} />
        </group>
        <group position={[0, 5, 0]} scale={1}>
          <Grape onClick={() => setScene("grape")} />
        </group>
      </Physics>
    </Canvas>
  );
};
