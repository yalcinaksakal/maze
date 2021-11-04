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
      <div className={styles.controls}>
        <button onClick={() => clicked("instant")}>Create Maze</button>
        <RangeBar type={"size"} />
        <RangeBar type={"complexity"} />
        <button onClick={() => clicked("simulate")}>Simulate Maze</button>
        <RangeBar type={"speed"} />
        <button onClick={() => clicked("toggle")}>Toggle Lines</button>
      </div>
      <Status />
      <Canvas />
      <Paragraph />
    </div>
  );
}

export default App;
