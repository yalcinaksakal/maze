import Canvas from "./components/Canvas/Canvas";

import styles from "./App.module.scss";
import buttonActions, {
  sceneController,
} from "./components/Canvas/MazeLib/buttonActions";
import Paragraph from "./components/Paragraph/Paragraph";
import Status from "./components/Status/Status";
import RangeBar from "./components/RangeBar/RangeBar";

function App() {
  const clicked = type => {
    buttonActions.pressed = true;
    buttonActions.type = type;
    sceneController();
  };
  return (
    <div className={styles.home}>
      <button onClick={() => clicked("instant")}>Create Maze</button>
      <button style={{ top: "125px" }} onClick={() => clicked("simulate")}>
        Simulate Maze
      </button>
      <button style={{ top: "210px" }} onClick={() => clicked("toggle")}>
        Toggle Lines
      </button>
      <Paragraph />
      <Canvas />
      <Status />
      <RangeBar type={"complexity"} />
      <RangeBar type={"speed"} />
      <RangeBar type={"size"} />
    </div>
  );
}

export default App;
