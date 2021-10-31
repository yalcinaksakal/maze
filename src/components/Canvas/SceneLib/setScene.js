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
import addPossibleCrossPathes from "../MazeLib/addPossibleCrossPaths";

import buttonActions from "../MazeLib/buttonActions";
import dijkstraAction from "../MazeLib/dijkstra";
import dDrawer from "../MazeLib/dijkstraDrawer";

import MazeGenerator from "../MazeLib/mazeGenerator";

// import createPath from "../MazeLib/createPath";

import myCam from "./camera";

// import createNodes, { createWalls } from "./createNodesAndWalls";
import createPlane from "./createPlane";

import createLights from "./lights";
// import drawer from "./pathDrawer";

import createR from "./renderer";
import setOrbitControls from "./setOrbitControls";

let dijkstraWorker = new Worker("./dijkstraWorker.js");

const setScene = () => {
  // let paths;
  let dpaths;
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

  //plane
  scene.add(createPlane());

  //nodes and walls
  // scene.add(createNodes());
  // scene.add(createWalls());

  //Mazegeneration-------------
  let line, walls, height, pathLines, visitor, maze, canAnimate;
  //visitor
  const geometry = new CylinderBufferGeometry(5, 5, 2, 64);
  const material = new MeshBasicMaterial({
    color: "red",
    // transparent: true,
    // opacity: 0.8,
  });
  const initialMazeSetup = () => {
    canAnimate = false;
    scene.remove(walls);
    // scene.remove(paths);
    walls = null;
    height = 16;
    //lines
    scene.remove(pathLines);
    scene.remove(dpaths);
    pathLines = new Group();
    scene.add(pathLines);

    //visitor
    scene.remove(visitor);
    visitor = new Mesh(geometry, material);
    visitor.position.set(-487, 10, -487);
    visitor.castShadow = true;
    scene.add(visitor);
    maze = new MazeGenerator(visitor);

    //worker
    dijkstraWorker.terminate();
    dijkstraWorker = new Worker("./dijkstraWorker.js");
  };

  const processMaze = () => {
    if (maze.canContinue) {
      line = maze.nodeTraveller();
      if (line) pathLines.add(line);
    } else if (!walls) {
      walls = maze.getWalls();
      scene.add(walls);
      addPossibleCrossPathes(maze.pathMap, maze.mazeSizeX, maze.mazeSizeY);
      dijkstraWorker.postMessage(
        JSON.stringify([maze.pathMap, maze.mazeSizeX, maze.mazeSizeY])
      );
      console.log("new worker");
      dijkstraWorker.onmessage = e => {
        console.log(JSON.parse(e.data));
      };
      // dpaths = dDrawer(
      //   dijkstraAction(maze.pathMap, maze.mazeSizeX, maze.mazeSizeY)
      // );
      // scene.add(dpaths);

      height = buttonActions.type === "instant" ? 15.9 : 0.1;
    }
    if (height < 16) {
      height += 0.1;
      walls.position.y = height;
      if (height >= 15.9) {
        canAnimate = false;

        // addPaths();
        scene.remove(visitor);
        scene.remove(pathLines);
      }
    }
  };

  // const addPaths = () => {
  //   paths = drawer(maze.pathMap);
  //   scene.add(paths);
  // };
  const instantMaze = () => {
    initialMazeSetup();
    while (maze.canContinue) processMaze();
    canAnimate = true;
  };
  const simulateMaze = () => {
    initialMazeSetup();
    canAnimate = true;
  };

  //animate--------------------

  const animate = () => {
    if (buttonActions.pressed) {
      buttonActions.pressed = false;
      buttonActions.type === "instant" ? instantMaze() : simulateMaze();
    }
    if (canAnimate) processMaze();
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
