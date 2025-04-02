import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Environment, OrbitControls } from "@react-three/drei";
import { Banana } from "./Banana";
import { Cherry } from "./Cherry";
import { Grape } from "./Grape";

export const HomeScene = ({ setScene }) => {
  return (
    <Canvas shadows camera={{ position: [0, 5, 150], fov: 90 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.7} />
      <Physics>
        <Environment preset="sunset" />
        <OrbitControls />
        <group position={[-100, 25, 0]} scale={1}>
          <Banana onClick={() => setScene("banana")} />
        </group>
        <group position={[0, 0, 0]} scale={15}>
          <Cherry onClick={() => setScene("cherry")} />
        </group>
        <group position={[100, 0, 0]} scale={10}>
          <Grape onClick={() => setScene("grape")} />
        </group>
      </Physics>
    </Canvas>
  );
};
