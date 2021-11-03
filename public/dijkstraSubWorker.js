let dijkstra, visitedNodes, previousNode, pathes, unvisitedDijkstraSortedArray;
//dijkstra: shortest distance from starting node
function dijkstraInit(x, y, pathLines) {
  if (!pathes) pathes = pathLines;
  unvisitedDijkstraSortedArray = [];
  dijkstra = {};
  visitedNodes = {};
  previousNode = {};
  dijkstra[`${x}-${y}`] = 0;
  visitedNodes[`${x}-${y}`] = 1;
}

const setDijkstraSortedArray = (x, y, value, processType) => {
  let low = 0,
    mid = 0,
    high = unvisitedDijkstraSortedArray.length;
  while (low < high) {
    mid = (low + high) >>> 1;
    if (unvisitedDijkstraSortedArray[mid].value < value) low = mid + 1;
    else high = mid;
  }
  //low is the position in sorted array
  if (processType === "delete") {
    let check = false,
      repeat = true;
    while (!check && repeat) {
      repeat = unvisitedDijkstraSortedArray[low]?.value === value;
      check =
        unvisitedDijkstraSortedArray[low]?.x === x &&
        unvisitedDijkstraSortedArray[low]?.y === y &&
        repeat;
      low++;
    }
    if (check) unvisitedDijkstraSortedArray.splice(low - 1, 1);
    return;
  }
  //add
  unvisitedDijkstraSortedArray.splice(low, 0, { x, y, value });
};

function setNewDistance(x1, y1, x2, y2, newDistance) {
  previousNode[`${x2}-${y2}`] = { x: x1, y: y1 };
  dijkstra[`${x2}-${y2}`] = newDistance;
  //if this node x2,y2 is visited , dont add into sorted array
  if (visitedNodes[`${x2}-${y2}`]) return;
  //if not visited, find old place and delete it from sorted arr
  setDijkstraSortedArray(x2, y2, newDistance, "delete");
  //find the correct position and add node to sorted arr
  setDijkstraSortedArray(x2, y2, newDistance, "add");
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
  let isNeighbourAccesable, newDistance;
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
}

const dijkstraManager = (x, y) => {
  let check = true,
    nodeToVisit;
  shortestPath(x, y);
  while (check) {
    //find which node to visit and visit it
    //choose from accassable(dijkstra[id] is not null) nodes  which is unvisited and have min distance

    nodeToVisit = unvisitedDijkstraSortedArray.shift();

    //mark next node as visited
    if (nodeToVisit) {
      nodeToVisit = `${nodeToVisit.x}-${nodeToVisit.y}`;
      visitedNodes[nodeToVisit] = 1;
      const coords = nodeToVisit.split("-");
      shortestPath(+coords[0], +coords[1]);
    } else check = false;
  }
};

function dijkstraAction(pathLines, startx, starty, sizeX, sizeY) {
  let min = null,
    exit,
    current;
  let path = [];

  dijkstraInit(startx, starty, pathLines);
  dijkstraManager(startx, starty);
  // shortestPath(startx, starty);

  //find shortest path to get out the maze
  let outY = starty ? 0 : sizeY - 1;
  for (let i = 0; i < sizeX; i++) {
    current = dijkstra[`${i}-${outY}`];
    if (!current) continue;
    if (!min || min > current) {
      exit = i;
      min = current;
    }
  }

  let x,
    temp,
    y,
    doesPathExist = true;
  // // if no path return reachable max distance as path
  // if (min === null) {
  //   temp = Object.keys(dijkstra)
  //     .reduce((a, b) => (dijkstra[a] > dijkstra[b] ? a : b))
  //     .split("-");
  //   exit = temp[0];
  //   outY = temp[1];
  //   doesPathExist = false;
  // }

  //if no path
  if (min === null) {
    for (const [k, v] of Object.entries(previousNode)) {
      temp = k.split("-");
      path.push({ x: +temp[0], y: +temp[1] }, v);
    }
    doesPathExist = false;
    return {
      path,
      direction: starty ? "down" : "up",
      doesPathExist,
    };
  }
  // crete path from previousnodes
  x = exit;
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
  return { path, direction: starty ? "down" : "up", doesPathExist };
}

onmessage = function (e) {
  const [x, y, startx, starty, pathes] = e.data;
  const result = dijkstraAction(pathes, startx, starty, x, y);
  postMessage(JSON.stringify(result));
};
