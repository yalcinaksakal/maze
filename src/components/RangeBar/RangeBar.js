import { useState, useEffect } from "react";
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
  const [maxVal, setMaxval] = useState(type === "size" ? 150 : 100);
  const style = {
    color: type === "speed" && +val === 0 ? "black" : "white",
  };

  useEffect(() => {
    if (window.innerWidth < 500) setMaxval(100);
  }, []);
  return (
    <div className={styles.c}>
      <input
        type={"range"}
        min={type === "size" ? 2 : type === "complexity" ? 1 : 0}
        max={maxVal}
        value={val}
        onChange={e => {
          setVal(e.currentTarget.value);
          if (type === "speed") changeSpedd(+e.currentTarget.value);
          else if (type === "complexity")
            changeComplexity(+e.currentTarget.value / 100);
          else changeSize(+e.currentTarget.value);
        }}
      />
      <p style={style}>{type + " : " + val}</p>
    </div>
  );
};
export default RangeBar;
