import { useState } from "react";
import {
  changeComplexity,
  changeSize,
  changeSpedd,
} from "../Canvas/MazeLib/buttonActions";

import styles from "./RangeBar.module.scss";

const RangeBar = ({ type }) => {
  const maxSize =
    window.innerWidth > 500 ? { max: 150, val: 50 } : { max: 70, val: 35 };
  const [val, setVal] = useState(
    type === "speed" ? 1 : type === "size" ? maxSize.val : 70
  );
  const style = {
    color: type === "speed" && +val === 0 ? "black" : "white",
  };

  return (
    <div className={styles.c}>
      <input
        type={"range"}
        min={type === "size" ? 2 : type === "complexity" ? 1 : 0}
        max={type === "size" ? maxSize.max : 100}
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
