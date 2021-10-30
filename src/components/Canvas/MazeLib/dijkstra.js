import addPossibleCrossPathes from "./addPossibleCrossPaths";

let dijkstra, visitedNodes, previousNode, pathes;
//dijkstra: shortest distance from starting node
function dijkstraInit(x, y, pathLines) {
  pathes = pathLines;

  dijkstra = {};
  visitedNodes = {};
  previousNode = {};
  dijkstra[`${x}-${y}`] = 0;
  visitedNodes[`${x}-${y}`] = 1;
}

function setNewDistance(x1, y1, x2, y2, newDistance) {
  previousNode[`${x2}-${y2}`] = { x: x1, y: y1 };
  dijkstra[`${x2}-${y2}`] = newDistance;
}

// 12-0:13-0  = 1  pathes from:to
const isAccessable = (x1, y1, x2, y2) => {
  if (pathes[`${x1}-${y1}:${x2}-${y2}`])
    return pathes[`${x1}-${y1}:${x2}-${y2}`];
  if (pathes[`${x2}-${y2}:${x1}-${y1}`])
    return pathes[`${x2}-${y2}:${x1}-${y1}`];
  return false;
};

function shortestPath(x, y) {
  //find all accessable neighbours
  let isNeighbourAccesable, nodeToVisit, newDistance;
  for (let i = -1; i < 2; i++)
    for (let j = -1; j < 2; j++) {
      if (!i && !j) continue;
      isNeighbourAccesable = isAccessable(x, y, x + i, y + j);
      if (!isNeighbourAccesable) continue;
      // isNeighbourAccesable holds distance to it
      newDistance = dijkstra[`${x}-${y}`] + isNeighbourAccesable;
      //if shortest path to this neighbour is infinity(assume undefined as infinity)
      if (dijkstra[`${x + i}-${y + j}`] === undefined)
        setNewDistance(x, y, x + i, y + j, newDistance);
      else if (dijkstra[`${x + i}-${y + j}`] > newDistance)
        setNewDistance(x, y, x + i, y + j, newDistance);
    }

  //find which node to visit and visit it
  nodeToVisit = null;
  newDistance = 0;
  //choose from accassable(dijkstra[id] is not null) nodes  which is unvisited and have min distance

  for (const [key, value] of Object.entries(dijkstra)) {
    if (!visitedNodes[key] && (value < newDistance || !nodeToVisit)) {
      nodeToVisit = key;
      newDistance = value;
    }
  }
  //mark next node as visited
  if (nodeToVisit) {
    visitedNodes[nodeToVisit] = 1;
    const coords = nodeToVisit.split("-");
    shortestPath(+coords[0], +coords[1]);
  }
}

export default function dijkstraAction(pathLines, sizeX, sizeY) {
  // for (let i = 0; i < 40; i++) {
  dijkstraInit(0, 0, pathLines);
  addPossibleCrossPathes(pathLines, sizeX, sizeY);
  shortestPath(0, 0);
  // console.log(pathes);
  // console.log(dijkstra);
  // console.log(previousNode);
  // }

  return { shortestDistanceToNodes: dijkstra, path: previousNode };
}
