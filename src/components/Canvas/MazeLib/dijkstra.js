import addPossibleCrossPathes from "./addPossibleCrossPaths";

let dijkstra,
  visitedNodes,
  previousNode,
  newDistance,
  nodeToVisit,
  pathes,
  mazeSizeX,
  mazeSizeY;
//dijkstra: shortest distance from starting node
function dijkstraInit(x, y, pathLines, sizeX, sizeY) {
  pathes = pathLines;
  mazeSizeX = sizeX;
  mazeSizeY = sizeY;
  dijkstra = {};
  visitedNodes = {};
  previousNode = {};
  dijkstra[`${x}-${y}`] = 0;
  visitedNodes[`${x}-${y}`] = 1;
}

// function setNewShortesPath(nodeId, neighbourId, newDistance) {
//   previousNode[neighbourId] = nodeId;
//   dijkstra[neighbourId] = newDistance;
// }

// 12-0:13-0  = 1  pathes from:to
// const isNodeAccessable = (x1, y1,x2,y2) =>{
//   if (pathes[`${x1}-${y1}:${x2}-${y2}`])
// }
//   !(
//     x < 0 ||
//     x > mazeSizeX - 1 ||
//     y < 0 ||
//     y > mazeSizeY - 1 ||
//     visitedNodes[`${x}-${y}`]
//   );

// function shortestPath(x,y) {
//   //find all accessable neighbours
//   for (let i = -1; i < 2; i++)
//     for (let j = -1; j < 2; j++){

//     }

//       !((!i && !j) || !isNodeValid(x + i, y + j)) &&
//         result.push({ x: x + i, y: y + j });

//   // Object.keys(nodesObj[nodeId].neighbours).forEach(neighbourId => {
//   //   newDistance =
//   //     dijkstra[nodeId] + nodesObj[nodeId].neighbours[neighbourId].distance;

//   //   //if shortest path to this neighbour is infinity(assume null as infinity)
//   //   if (dijkstra[neighbourId] === undefined)
//   //     setNewShortesPath(nodeId, neighbourId, newDistance);
//   //   else if (dijkstra[neighbourId] > newDistance)
//   //     setNewShortesPath(nodeId, neighbourId, newDistance);
//   });

//   //find which node to visit and visit it
//   nodeToVisit = null;
//   newDistance = 0;
//   //choose from unvisited nodes which is accassable(dijkstra[id] is not null) and have min distance
//   for (let i = 0; i < visitArray.length; i++) {
//     if (!dijkstra[i] || visitArray[i]) continue; //if node is not accessable or visited  continue
//     //thi node is unvisited and accessable;
//     //if node  has min distance  or we havent choosen a node yet, choose it
//     if (dijkstra[i] < newDistance || !nodeToVisit) {
//       nodeToVisit = i;
//       newDistance = dijkstra[i];
//     }
//   }
//   //mark next node as visited
//   if (nodeToVisit) {
//     visitArray[nodeToVisit] = 1;
//     shortestPath(nodeToVisit);
//   }
// }

export default function dijkstraAction(pathLines, sizeX, sizeY) {
  // for (let i = 0; i < 40; i++) {
  dijkstraInit(
    0,
    0,
    addPossibleCrossPathes(pathLines, sizeX, sizeY),
    sizeX,
    sizeY
  );

  console.log(pathes);
  // shortestPath(0, 0);
  // }

  return { shortestDistanceToNodes: dijkstra, path: previousNode };
}
