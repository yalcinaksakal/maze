import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setSceneController } from "./MazeLib/buttonActions";

import setScene from "./SceneLib/setScene";

const Canvas = () => {
  const canvasRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("canvas");

    const { domElement, onResize, animate } = setScene(dispatch);
    setSceneController(animate);
    canvasRef.current.appendChild(domElement);
    //resize
    window.addEventListener("resize", onResize);

    //cleanup
    return () => {
      window.removeEventListener("resize", onResize);

      domElement.remove();
    };
  }, [dispatch]);

  return (
    <div
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
      }}
    ></div>
  );
};

export default Canvas;
