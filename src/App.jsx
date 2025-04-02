import "./App.css";
import { HomeScene } from "./components/HomeScene";
import { AboutScene } from "./components/AboutScene";
import { BananaScene } from "./components/BananaScene";
import { CherryScene } from "./components/CherryScene";
import { GrapeScene } from "./components/GrapeScene";
import { StatementScene } from "./components/StatementScene";
import Navbar from "./components/Navbar";
import { useState } from "react";

function App() {
  const [scene, setScene] = useState("home");

  return (
    <div>
      <Navbar setScene={setScene} />

      {scene === "home" && <HomeScene setScene={setScene} />}
      {scene === "about" && <AboutScene setScene={setScene} />}
      {scene === "banana" && <BananaScene setScene={setScene} />}
      {scene === "cherry" && <CherryScene setScene={setScene} />}
      {scene === "grape" && <GrapeScene setScene={setScene} />}
      {scene === "statement" && <StatementScene setScene={setScene} />}
    </div>
  );
}

export default App;
