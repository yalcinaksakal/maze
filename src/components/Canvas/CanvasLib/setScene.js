import {
  BoxBufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  Scene,
} from "three";

import myCam from "./camera";
import createPlane from "./createPlane";

import createLights from "./lights";

import createR from "./renderer";
import setOrbitControls from "./setOrbitControls";

const setScene = (appenderFunc, dispatch, actions) => {
  //renderer
  const renderer = createR();
  //camera
  const camera = myCam();
  //scene
  const scene = new Scene();
  scene.background = new Color("#748B97");
  //lights
  const lights = createLights();

  Object.values(lights).forEach(light => scene.add(light));

  //domEL
  const { domElement } = renderer;

  //add controls
  const controls = setOrbitControls(camera, domElement);

  //cube

  const geometry = new BoxBufferGeometry(30, 200, 30);
  const material = new MeshBasicMaterial({ color: "gray" });
  const cube = new Mesh(geometry, material);
  cube.castShadow = true;
  cube.position.set(0, 101, 0);
  scene.add(cube);

  //plane
  scene.add(createPlane());

  //animate
  const animate = () => {
    renderer.render(scene, camera);
    controls.update();
  };

  //onResize
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  const keyDownHandler = ({ code }) => {};
  const keyUpHandler = ({ code }) => {};

  return {
    animate,
    domElement,
    onResize,
    keyDownHandler,
    keyUpHandler,
  };
};

export default setScene;
