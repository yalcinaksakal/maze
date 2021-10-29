import { PerspectiveCamera } from "three";

const myCam = () => {
  const aspect = window.innerWidth / window.innerHeight;
  const fov = 60;
  const near = 1.0;
  const far = 7000.0;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 300, -1200);
  return camera;
};

export default myCam;
