import { useState } from "react";
import { changeComplexity, changeSpedd } from "../Canvas/MazeLib/buttonActions";
import styles from "./RangeBar.module.scss";

const RangeBar = ({ type }) => {
  const [val, setVal] = useState(70);
  const style = { top: type === "speed" ? "150px" : "110px" };
  return (
    <div style={style} className={styles.c}>
      <input
        type={"range"}
        min={0}
        max={100}
        value={val}
        onChange={e => {
          setVal(e.currentTarget.value);
          if (type === "speed") changeSpedd(+e.currentTarget.value / 11 + 1);
          else changeComplexity(+e.currentTarget.value / 100);
        }}
      />
      <p>{type === "speed" ? "simulation speed" : "complexity"}</p>
    </div>
  );
};
export default RangeBar;
