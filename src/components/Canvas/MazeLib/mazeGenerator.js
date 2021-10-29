import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from "three";

const material = new LineBasicMaterial({
  color: "dodgerblue",
});

class MazeGenerator {
  visitedNodes = {};
  numVisitedNodes = 0;
  pathMap = {};
  stack = [];
  canContinue = true;
  constructor(visitor, mazeSizeX = 40, mazeSizeY = 40, startX = 0, startY = 0) {
    this.visitor = visitor;
    this.mazeSizeX = mazeSizeX;
    this.mazeSizeY = mazeSizeY;
    this.X = startX ? startX : this.pickRandomly(40);
    this.Y = startY;
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

  drawer = (x, y) => {
    const oldPoint = new Vector3(-487 + this.X * 25, 10, -487 + this.Y * 25);
    const newPoint = new Vector3(-487 + x * 25, 10, -487 + y * 25);
    const geometry = new BufferGeometry().setFromPoints([oldPoint, newPoint]);
    this.X = x;
    this.Y = y;
    return new Line(geometry, material);
  };

  nodeTraveller = () => {
    const neighbours = this.getVisitableNeighbours(this.X, this.Y);
    if (!neighbours.length) {
      this.stack.pop();
      this.X = this.stack[this.stack.length - 1].x;
      this.Y = this.stack[this.stack.length - 1].y;
      this.visitor.position.set(-487 + this.X * 25, 10, -487 + this.Y * 25);
      return null;
    } else {
      let { x, y } = neighbours[this.pickRandomly(neighbours.length)];
      this.pathMap[`${this.X}-${this.Y}:${x}-${y}`] = 1;
      this.visitor.position.set(-487 + x * 25, 10, -487 + y * 25);
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
