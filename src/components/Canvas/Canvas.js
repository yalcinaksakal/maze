import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import setScene from "./SceneLib/setScene";

const Canvas = () => {
  const canvasRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("canvas");

    const { domElement, onResize, animate, keyDownHandler, keyUpHandler } =
      setScene(dispatch);
    canvasRef.current.appendChild(domElement);
    let frameId;

    const RAF = () => {
      animate();
      frameId = requestAnimationFrame(RAF);
    };

    //resize
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    //start animation
    RAF();

    //cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("keyup", keyUpHandler);
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
