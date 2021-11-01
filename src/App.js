import Canvas from "./components/Canvas/Canvas";

import styles from "./App.module.scss";
import buttonActions from "./components/Canvas/MazeLib/buttonActions";
import Paragraph from "./components/Paragraph/Paragraph";
import Status from "./components/Status/Status";
import RangeBar from "./components/RangeBar/RangeBar";

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
      <button style={{ top: "69px" }} onClick={() => clicked("toggle")}>
        Toggle Lines
      </button>
      <Paragraph />
      <Canvas />
      <Status />
      <RangeBar type={"complexity"} />
      <RangeBar type={"speed"} />
    </div>
  );
}

export default App;
