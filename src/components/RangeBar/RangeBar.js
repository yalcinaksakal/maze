import { useState } from "react";
import {
  changeComplexity,
  changeSize,
  changeSpedd,
} from "../Canvas/MazeLib/buttonActions";

import styles from "./RangeBar.module.scss";

const RangeBar = ({ type }) => {
  const [val, setVal] = useState(
    type === "speed" ? 1 : type === "size" ? 50 : 70
  );
  const style = {
    top: type === "size" ? "40px" : type === "speed" ? "165px" : "80px",
  };

  return (
    <div style={style} className={styles.c}>
      <input
        type={"range"}
        min={type === "size" ? 2 : 0}
        max={type === "size" ? 150 : 100}
        value={val}
        onChange={e => {
          setVal(e.currentTarget.value);
          if (type === "speed") changeSpedd(+e.currentTarget.value);
          else if (type === "complexity")
            changeComplexity(+e.currentTarget.value / 100);
          else changeSize(+e.currentTarget.value);
        }}
      />

      <p>
        {type === "size"
          ? "Size : "
          : type === "speed"
          ? "simulation speed : "
          : "complexity : "}
        {val}
      </p>
    </div>
  );
};
export default RangeBar;
