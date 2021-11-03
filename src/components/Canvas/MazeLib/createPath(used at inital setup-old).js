import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from "three";

const material = new LineBasicMaterial({
  color: "dodgerblue",
  transparent: true,
  opacity: 0.2,
});

const createPath = (
  pathLines,
  visitor,
  mazeSizeX = 40,
  mazeSizeY = 40,
  startX = 0,
  startY = 0
) => {
  const visitedNodes = {};
  let numVisitedNodes = 0;
  const pathMap = {};

  const isNodeValid = (x, y) =>
    !(
      x < 0 ||
      x > mazeSizeX - 1 ||
      y < 0 ||
      y > mazeSizeY - 1 ||
      visitedNodes[`${x}-${y}`]
    );

  const getVisitableNeighbours = (x, y) => {
    const result = [];
    for (let i = -1; i < 2; i++)
      for (let j = -1; j < 2; j++)
        !(i * j || (!i && !j) || !isNodeValid(x + i, y + j)) &&
          result.push({ x: x + i, y: y + j });

    return result;
  };

  const pickRandomly = length => Math.floor(Math.random() * length);

  const drawer = (x, y) => {
    const newPoint = new Vector3(-487 + x * 25, 10, -487 + y * 25);
    const geometry = new BufferGeometry().setFromPoints([
      visitor.position,
      newPoint,
    ]);

    pathLines.add(new Line(geometry, material));
  };

  const nodeTraveller = (x, y) => {
    let neighbours, nextNode;
    numVisitedNodes++;

    let canContinue = numVisitedNodes !== mazeSizeX * mazeSizeY;
    visitedNodes[`${x}-${y}`] = 1;
    while (canContinue) {
      visitor.position.set(-487 + x * 25, 10, -487 + y * 25);
      neighbours = getVisitableNeighbours(x, y);
      canContinue = neighbours.length;

      if (canContinue) {
        nextNode = neighbours[pickRandomly(neighbours.length)];
        pathMap[`${x}-${y}:${nextNode.x}-${nextNode.y}`] = 1;

        drawer(nextNode.x, nextNode.y);
        nodeTraveller(nextNode.x, nextNode.y);
      }
    }
  };
  nodeTraveller(startX ? startX : pickRandomly(40), startY);
  return pathMap;
};
export default createPath;
