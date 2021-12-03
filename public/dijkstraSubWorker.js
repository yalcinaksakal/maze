let dijkstra,
  visitedNodes,
  previousNode,
  pathes,
  unvisitedDijkstraSortedArray,
  startx,
  starty;

//dijkstra: shortest distance from starting node
function dijkstraInit(x, y, pathLines) {
  if (!pathes) pathes = pathLines;
  startx = x;
  starty = y;
  unvisitedDijkstraSortedArray = [];
  dijkstra = {};
  visitedNodes = {};
  previousNode = {};
  dijkstra[`${x}-${y}`] = 0;
  visitedNodes[`${x}-${y}`] = 1;
}

let low, mid, high;
const setDijkstraSortedArray = (x, y, value, processType) => {
  low = 0;
  mid = 0;
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
let oldDistance, isNeighbourAccesable, newDistance;

function setNewDistance(x1, y1, x2, y2, nD) {
  previousNode[`${x2}-${y2}`] = { x: x1, y: y1 };
  oldDistance = dijkstra[`${x2}-${y2}`];
  dijkstra[`${x2}-${y2}`] = nD;
  //if this node x2,y2 is visited , dont add into sorted array
  if (visitedNodes[`${x2}-${y2}`]) return;
  //if not visited, find old place and delete it from sorted arr
  if (oldDistance) setDijkstraSortedArray(x2, y2, oldDistance, "delete");
  //find the correct position and add node to sorted arr
  setDijkstraSortedArray(x2, y2, nD, "add");
}
// 12-0:13-0  = 1  pathes from:to
const isAccessable = (x1, y1, x2, y2) =>
  pathes[`${x1}-${y1}:${x2}-${y2}`] || pathes[`${x2}-${y2}:${x1}-${y1}`];

function shortestPath(x, y) {
  //find all accessable neighbours
  for (let i = -1; i < 2; i++)
    for (let j = -1; j < 2; j++) {
      if (!i && !j) continue;
      isNeighbourAccesable = isAccessable(x, y, x + i, y + j);
      if (!isNeighbourAccesable) continue;
      // isNeighbourAccesable holds distance to it
      newDistance = dijkstra[`${x}-${y}`] + isNeighbourAccesable;
      //if shortest path to this neighbour is infinity(assume undefined as infinity)
      if (
        dijkstra[`${x + i}-${y + j}`] === undefined ||
        dijkstra[`${x + i}-${y + j}`] > newDistance
      )
        setNewDistance(x, y, x + i, y + j, newDistance);
    }
}

const dijkstraManager = () => {
  let check = true,
    nodeToVisit;
  shortestPath(startx, starty);
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

  return { dijkstra, previousNode, startx, starty };
};

onmessage = function (e) {
  const [startx, starty, pathes] = e.data;
  dijkstraInit(startx, starty, pathes);
  this.postMessage(dijkstraManager());
};
