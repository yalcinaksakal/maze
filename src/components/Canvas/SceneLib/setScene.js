import {
  Color,
  CylinderBufferGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  Scene,
} from "three";

import { statusActions } from "../../../store/status";
import addPossibleCrossPathes from "../MazeLib/addPossibleCrossPaths";

import buttonActions, { complexity } from "../MazeLib/buttonActions";

import dDrawer from "../MazeLib/dijkstraDrawer";

import MazeGenerator from "../MazeLib/mazeGenerator";

import myCam, { changeCamPos } from "./camera";

import createPlane from "./createPlane";

import createLights from "./lights";
import noPathDrawer from "./noPathDrawer";

import createR from "./renderer";
import setOrbitControls from "./setOrbitControls";

let dijkstraWorker;

//visitor
const geometry = new CylinderBufferGeometry(25, 25, 5, 64);
const material = new MeshBasicMaterial({
  color: "red",
  // transparent: true,
  // opacity: 0.8,
});
const visitor = new Mesh(geometry, material);
visitor.position.set(-487, 10, -487);
visitor.castShadow = true;
visitor.visible = false;

const setScene = statusFunc => {
  let plane, dijkstraPaths, line, walls, height, pathLines, maze, canAnimate;
  //renderer
  const renderer = createR();

  //camera, inital position is (50/2)*25, maze's inital size is 50
  const camera = myCam(1250);
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

  //nodes and walls
  // scene.add(createNodes());
  // scene.add(createWalls());

  const groupCreator = () => {
    const newGroup = new Group();
    scene.add(newGroup);
    return newGroup;
  };

  //initial objects------------
  //visitor
  scene.add(visitor);
  //lines
  pathLines = groupCreator();
  //dijkstra paths
  dijkstraPaths = groupCreator();
  //dijkstra paths
  walls = groupCreator();
  //plane
  plane = createPlane(1250);
  scene.add(plane);

  //Mazegeneration-------------
  const initialMazeSetup = () => {
    canAnimate = false;
    height = 16;

    //plane
    scene.remove(plane);
    plane = createPlane(25 * complexity.size);
    scene.add(plane);

    //visitor
    visitor.visible = true;
    //maze
    // maze = null;
    maze = new MazeGenerator(visitor);

    //camera

    changeCamPos(
      25 * (window.innerWidth > 600 ? complexity.size / 1.5 : complexity.size)
    );
    //worker
    dijkstraWorker?.terminate();
    dijkstraWorker = new Worker("./dijkstraWorker.js");

    //dijkstraPaths,lines,walls
    const resetGroups = items => {
      items.forEach(item => {
        item.children = [];
        item.visible = true;
      });
    };
    resetGroups([dijkstraPaths, pathLines, walls]);

    statusFunc(statusActions.stop());
  };

  const processMaze = () => {
    if (maze.canContinue) {
      //simulation speed
      const numOfMove =
        complexity.speed * (maze.mazeSizeX > 100 ? maze.mazeSizeX / 75 : 1);
      for (let i = 0; i < numOfMove; i++) {
        if (!maze.canContinue) break;
        line = maze.nodeTraveller();
        if (line) pathLines.add(line);
      }
    } else if (!walls.children.length) {
      walls = maze.getWalls(walls);
      visitor.visible = false;
      pathLines.visible = false;

      addPossibleCrossPathes(maze.pathMap, maze.mazeSizeX, maze.mazeSizeY);
      // starting workers
      statusFunc(
        statusActions.setCalculating({
          total: 2 * maze.mazeSizeX,
          calculating: true,
        })
      );

      dijkstraWorker.postMessage([
        maze.pathMap,
        maze.mazeSizeX,
        maze.mazeSizeY,
      ]);

      dijkstraWorker.onmessage = e => {
        statusFunc(statusActions.addDone(e.data.length));
        //empty nopaths data.type=emptyNoPaths

        !e.data.type &&
          e.data.forEach(d => {
            dijkstraPaths.add(...dDrawer(d, maze.start));
            requestRenderIfNotRequested();
          });

        if ((e.data.type = "nodesOfNoPaths")) {
          // console.log(e.data.nodesOfNoPaths);
          // dijkstraPaths.add(noPathDrawer(e.data.nodesOfNoPaths));
          // dijkstraWorker.terminate();
          // dijkstraWorker = null;
          // statusFunc(statusActions.stop());
          // requestRenderIfNotRequested();
        }
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

  const mazeAnimationControl = () => {
    if (canAnimate) {
      animate();
      requestAnimationFrame(mazeAnimationControl);
    }
  };

  const start = () => {
    canAnimate = true;
    mazeAnimationControl();
  };

  const instantMaze = () => {
    initialMazeSetup();
    while (maze.canContinue) processMaze();
    start();
  };
  const simulateMaze = () => {
    initialMazeSetup();
    start();
  };

  const toggleLines = () => (dijkstraPaths.visible = !dijkstraPaths.visible);

  //animate--------------------
  let renderRequested = false;

  const render = () => {
    if (renderRequested) renderRequested = undefined;
    controls.update();
    renderer.render(scene, camera);
  };

  const animate = () => {
    if (buttonActions.pressed) {
      buttonActions.pressed = false;
      buttonActions.type === "instant"
        ? instantMaze()
        : buttonActions.type === "simulate"
        ? simulateMaze()
        : toggleLines();
    }
    processMaze();
    //scene
    render();
  };

  // request animation when user interacts, orbitcontrols change
  function requestRenderIfNotRequested() {
    //if it is already animating return
    if (canAnimate) return;
    // animate on changes in orbits
    if (!renderRequested) {
      renderRequested = true;
      requestAnimationFrame(render);
    }
  }
  controls.addEventListener("change", requestRenderIfNotRequested);
  //init
  render();

  //onResize
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    requestRenderIfNotRequested();
  };

  return {
    domElement,
    onResize,
    animate,
  };
};

export default setScene;
