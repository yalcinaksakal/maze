import Canvas from "./components/Canvas/Canvas";

import styles from "./App.module.scss";
import buttonActions from "./components/Canvas/MazeLib/buttonActions";
import Paragraph from "./components/Paragraph/Paragraph";

function App() {
  const clicked = type => {
    buttonActions.pressed = true;
    buttonActions.type = type;
  };
  return (
    <div className={styles.home}>
      <button onClick={() => clicked("instant")}>Create Maze</button>
      <button style={{ top: "35px" }} onClick={() => clicked("simulate")}>
        Simulate Maze
      </button>
      <Paragraph />
      <Canvas />
    </div>
  );
}

export default App;
