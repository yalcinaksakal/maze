import { PerspectiveCamera } from "three";
const aspect = window.innerWidth / window.innerHeight;
const fov = 60;
const near = 1.0;
const far = 10000.0;
const camera = new PerspectiveCamera(fov, aspect, near, far);

export const changeCamPos = newPos => {
  camera.position.set(-newPos / 4, newPos * 1.5, -newPos);
};

const myCam = pos => {
  //(-25*mazeSizeX,height,-25*mazeSizeY)
  camera.position.set(-pos / 2, pos * 2, -pos / 2);
  return camera;
};

export default myCam;
