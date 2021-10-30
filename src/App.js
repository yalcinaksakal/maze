import Canvas from "./components/Canvas/Canvas";

import styles from "./App.module.scss";
import buttonActions from "./components/Canvas/MazeLib/buttonActions";

function App() {
  const clicked = type => {
    buttonActions.pressed = true;
    buttonActions.type = type;
  };
  return (
    <div className={styles.home}>
      <button onClick={() => clicked("instant")}>Instant Maze</button>
      <button style={{ top: "35px" }} onClick={() => clicked("simulate")}>
        Simulate Maze
      </button>
      <Canvas />
    </div>
  );
}

export default App;
