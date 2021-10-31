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
import { statusActions } from "../../../store/status";
import addPossibleCrossPathes from "../MazeLib/addPossibleCrossPaths";

import buttonActions from "../MazeLib/buttonActions";
// import dijkstraAction from "../MazeLib/dijkstra";
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

let dijkstraWorker;

const setScene = statusFunc => {
  // let paths;
  let dijkstraPaths;
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
    dijkstraWorker?.terminate();
    dijkstraWorker = new Worker("./dijkstraWorker.js");

    //dijkstraPaths
    scene.remove(dijkstraPaths);
    dijkstraPaths = new Group();
    scene.add(dijkstraPaths);

    statusFunc(statusActions.stop());
  };

  const processMaze = () => {
    if (maze.canContinue) {
      line = maze.nodeTraveller();
      if (line) pathLines.add(line);
    } else if (!walls) {
      walls = maze.getWalls();
      scene.add(walls);
      scene.remove(visitor);
      scene.remove(pathLines);

      addPossibleCrossPathes(maze.pathMap, maze.mazeSizeX, maze.mazeSizeY);
      //starting workers
      statusFunc(
        statusActions.setCalculating({
          total: 2 * maze.mazeSizeX,
          calculating: true,
        })
      );
      dijkstraWorker.postMessage(
        JSON.stringify([maze.pathMap, maze.mazeSizeX, maze.mazeSizeY])
      );

      dijkstraWorker.onmessage = e => {
        statusFunc(statusActions.addDone());
        e.data !== "null" && dijkstraPaths.add(...dDrawer(JSON.parse(e.data)));
      };
      // -------
      height = buttonActions.type === "instant" ? 15.9 : 0.1;
    }
    if (height < 16) {
      height += 0.1;
      walls.position.y = height;
      if (height >= 15.9) {
        canAnimate = false;
      }
    }
  };

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
