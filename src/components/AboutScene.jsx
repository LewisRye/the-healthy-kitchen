import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export const AboutScene = ({ setScene }) => {
  return (
    <Canvas>
      <Html position={[0, 0, 0]} center>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "32px",
            }}
          >
            About
          </span>
        </div>
      </Html>
    </Canvas>
  );
};
