import "./App.css";
import { HomeScene } from "./components/HomeScene";
import { AboutScene } from "./components/AboutScene";
import { BananaScene } from "./components/BananaScene";
import { CherryScene } from "./components/CherryScene";
import { GrapeScene } from "./components/GrapeScene";
import { StatementScene } from "./components/StatementScene";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [scene, setScene] = useState("home");

  const getSceneComponent = () => {
    switch (scene) {
      case "home":
        return <HomeScene setScene={setScene} />;
      case "about":
        return <AboutScene setScene={setScene} />;
      case "banana":
        return <BananaScene setScene={setScene} />;
      case "cherry":
        return <CherryScene setScene={setScene} />;
      case "grape":
        return <GrapeScene setScene={setScene} />;
      case "statement":
        return <StatementScene setScene={setScene} />;
      default:
        return <HomeScene setScene={setScene} />;
    }
  };

  return (
    <div>
      <Navbar setScene={setScene} />

      {/* ensure each scene fades in and out */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {getSceneComponent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
