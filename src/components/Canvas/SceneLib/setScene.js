import {
  // BoxBufferGeometry,
  Color,
  CylinderBufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  // Mesh,
  // MeshBasicMaterial,
  Scene,
} from "three";
import MazeGenerator from "../MazeLib/mazeGenerator";
// import createPath from "../MazeLib/createPath";

import myCam from "./camera";

// import createNodes, { createWalls } from "./createNodesAndWalls";
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

  // const geometry = new BoxBufferGeometry(30, 200, 30);
  // const material = new MeshBasicMaterial({ color: "gray" });
  // const cube = new Mesh(geometry, material);
  // cube.castShadow = true;
  // cube.position.set(0, 101, 0);
  // scene.add(cube);

  //plane
  scene.add(createPlane());

  //nodes and walls
  // scene.add(createNodes());
  // scene.add(createWalls());

  //Mazegeneration-------------
  //lines
  const pathLines = new Group();
  scene.add(pathLines);
  //visitor
  const geometry = new CylinderBufferGeometry(5, 5, 2, 64);
  const material = new MeshBasicMaterial({
    color: "red",
    // transparent: true,
    // opacity: 0.8,
  });
  const visitor = new Mesh(geometry, material);
  visitor.position.set(-487, 10, -487);
  visitor.castShadow = true;
  scene.add(visitor);
  const maze = new MazeGenerator(visitor);
  // console.log(createPath(pathLines, visitor));
  //animate--------------------
  let line;
  let walls = null;
  let height = 16;
  const animate = () => {
    if (maze.canContinue) {
      line = maze.nodeTraveller();
      if (line) pathLines.add(line);
    } else if (!walls) {
      walls = maze.getWalls();
      scene.add(walls);
      scene.remove(visitor);
      scene.remove(pathLines);
      height = 1;
    }
    if (height < 16) {
      height += 0.1;
      walls.position.y += 0.1;
    }
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
