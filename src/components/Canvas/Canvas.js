import { useEffect, useRef } from "react";

import setScene from "./SceneLib/setScene";

const Canvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    // console.log("canvas");
    const appender = () => canvasRef.current.appendChild(domElement);
    const { domElement, onResize, animate, keyDownHandler, keyUpHandler } =
      setScene();
    appender();
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
  }, []);

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
