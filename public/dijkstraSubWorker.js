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

function dijkstraAction(pathLines, startx, starty, sizeX, sizeY) {
  let min = null,
    exit,
    current;
  let path = [];

  dijkstraInit(startx, starty, pathLines);
  shortestPath(startx, starty);

  //find shortest path to get out the maze
  const outY = starty ? 0 : sizeY - 1;
  for (let i = 0; i < sizeX - 1; i++) {
    current = dijkstra[`${i}-${outY}`];
    if (!current) continue;
    if (!min || min > current) {
      exit = i;
      min = current;
    }
  }
  //if no path
  if (min === null) return null;
  //crete path from previousnodes
  let x = exit,
    temp,
    y = outY;

  path.unshift({ x: exit, y: starty ? -5 : sizeY + 4 });
  path.unshift({ x: exit, y });

  while (x !== startx || y !== starty) {
    temp = previousNode[`${x}-${y}`];
    x = temp.x;
    y = temp.y;
    path.unshift({ x, y });
  }
  path.unshift({ x, y: starty ? sizeY : -1 });

  return { path, direction: starty ? "down" : "up" };
}

onmessage = function (e) {
  const [pathes, x, y, startx, starty] = e.data;
  const result = dijkstraAction(pathes, startx, starty, x, y);
  postMessage(result ? JSON.stringify(result) : "null");
};
