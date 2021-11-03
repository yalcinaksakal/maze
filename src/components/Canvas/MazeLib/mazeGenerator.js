import {
  BoxBufferGeometry,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";
import { complexity } from "./buttonActions";

const material = new LineBasicMaterial({
  color: "dodgerblue",
  //   transparent: true,
  //   opacity: 0.2,
});

const boxGeometryHorizantal = new BoxBufferGeometry(25, 15, 1);
const boxGeometryVertical = new BoxBufferGeometry(1, 15, 25);
const boxMaterial = new MeshBasicMaterial({
  color: "#393b5b",
  transparent: true,
  opacity: 0.8,
});

class MazeGenerator {
  visitedNodes = {};
  numVisitedNodes = 0;
  pathMap = {};
  stack = [];
  canContinue = true;
  constructor(
    visitor,
    mazeSizeX = complexity.size,
    mazeSizeY = complexity.size,
    startX = 0,
    startY = 0
  ) {
    this.visitor = visitor;
    this.mazeSizeX = mazeSizeX;
    this.mazeSizeY = mazeSizeY;
    this.X = startX ? startX : this.pickRandomly(mazeSizeX);
    this.Y = startY;
    this.mazeComplexity = complexity;
    this.start = -(mazeSizeX * 25) / 2;
  }

  isNodeValid = (x, y) =>
    !(
      x < 0 ||
      x > this.mazeSizeX - 1 ||
      y < 0 ||
      y > this.mazeSizeY - 1 ||
      this.visitedNodes[`${x}-${y}`]
    );

  getVisitableNeighbours = (x, y) => {
    const result = [];
    for (let i = -1; i < 2; i++)
      for (let j = -1; j < 2; j++)
        !(i * j || (!i && !j) || !this.isNodeValid(x + i, y + j)) &&
          result.push({ x: x + i, y: y + j });
    return result;
  };

  pickRandomly = length => Math.floor(Math.random() * length);

  getWalls(walls) {
    let wall;
    const doesPathExist = (x1, y1, x2, y2) =>
      this.pathMap[`${x1}-${y1}:${x2}-${y2}`] ||
      this.pathMap[`${x2}-${y2}:${x1}-${y1}`];
    for (let i = -1; i < this.mazeSizeX; i++)
      for (let j = 0; j < this.mazeSizeY; j++) {
        //block some
        if (
          this.mazeComplexity.c > 0.2 &&
          j > 5 &&
          j < this.mazeSizeY - 5 &&
          Math.random() > 0.99
        )
          this.pathMap[`${i}-${j}:${i}-${j - 1}`] = null;

        //down wall
        if (!doesPathExist(i, j, i, j - 1) && i > -1 && j > 0) {
          // open some more possibilites
          if (Math.random() > this.mazeComplexity.c) {
            // console.log(`${i}-${j}:${i}-${j - 1}`);
            this.pathMap[`${i}-${j}:${i}-${j - 1}`] = 1;
          } else {
            wall = new Mesh(boxGeometryHorizantal, boxMaterial);
            wall.position.set(
              this.start + 13 + i * 25,
              -7.5,
              this.start + j * 25
            );
            wall.castShadow = true;
            wall.receiveShadow = true;
            walls.add(wall);
          }
        }
        //right wall
        if (!doesPathExist(i, j, i + 1, j)) {
          if (
            Math.random() > this.mazeComplexity.c &&
            i > -1 &&
            i < this.mazeSizeX - 1
          ) {
            // console.log(`${i}-${j}:${i + 1}-${j}`);
            this.pathMap[`${i}-${j}:${i + 1}-${j}`] = 1;
          } else {
            wall = new Mesh(boxGeometryVertical, boxMaterial);
            wall.position.set(
              this.start + 25 + i * 25,
              -7.5,
              this.start + 13 + j * 25
            );
            wall.castShadow = true;
            wall.receiveShadow = true;
            walls.add(wall);
          }
        }
      }
    return walls;
  }

  drawer = (x, y) => {
    const oldPoint = new Vector3(
      this.start + 13 + this.X * 25,
      10,
      this.start + 13 + this.Y * 25
    );
    const newPoint = new Vector3(
      this.start + 13 + x * 25,
      10,
      this.start + 13 + y * 25
    );
    const geometry = new BufferGeometry().setFromPoints([oldPoint, newPoint]);
    this.X = x;
    this.Y = y;
    return new Line(geometry, material);
  };

  nodeTraveller = () => {
    const neighbours = this.getVisitableNeighbours(this.X, this.Y);
    if (!neighbours.length) {
      this.stack.pop();
      this.X = this.stack[this.stack.length - 1]?.x;
      this.Y = this.stack[this.stack.length - 1]?.y;
      this.visitor.position.set(
        this.start + 13 + this.X * 25,
        10,
        this.start + 13 + this.Y * 25
      );
      return null;
    } else {
      let { x, y } = neighbours[this.pickRandomly(neighbours.length)];

      this.pathMap[`${this.X}-${this.Y}:${x}-${y}`] = 1;
      this.visitor.position.set(
        this.start + 13 + x * 25,
        10,
        this.start + 13 + y * 25
      );
      this.stack.push({ x, y });
      this.numVisitedNodes++;
      this.canContinue =
        this.numVisitedNodes !== this.mazeSizeX * this.mazeSizeY;
      this.visitedNodes[`${x}-${y}`] = 1;
      return this.drawer(x, y);
    }
  };
}
export default MazeGenerator;
