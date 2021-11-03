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
  const pathes = {};
  for (let start = 0; start < sizeX; start++) {
    let min = null,
      exit,
      current;
    let path = [];

    dijkstraInit(start, 0, pathLines);
    shortestPath(start, 0);

    //find shortest path to get out the maze
    for (let i = 0; i < sizeX - 1; i++) {
      current = dijkstra[`${i}-${sizeY - 1}`];
      if (!current) continue;
      if (!min || min > current) {
        exit = i;
        min = current;
      }
    }
    //if no path
    if (min === null) continue;
    //crete path from previousnodes
    let x = exit,
      temp,
      y = sizeY - 1;

    path.unshift({ x: exit, y: sizeY });
    path.unshift({ x: exit, y: sizeY - 1 });
    while (x !== start || y !== 0) {
      temp = previousNode[`${x}-${y}`];
      x = temp.x;
      y = temp.y;
      path.unshift({ x, y });
    }
    path.unshift({ x, y: -1 });

    pathes[start] = { path: [...path] };
  }
  return pathes;
}
