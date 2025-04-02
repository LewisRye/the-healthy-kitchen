import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export const StatementScene = ({ setScene }) => {
  return (
    <Canvas>
      <Html position={[0, 0, 0]} center>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontSize: "32px",
            }}
          >
            Statement of Originality
          </span>
        </div>
      </Html>
    </Canvas>
  );
};
