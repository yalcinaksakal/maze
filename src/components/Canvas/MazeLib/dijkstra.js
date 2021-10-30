let dijkstra, visitedNodes, previousNode, newDistance, nodeToVisit, pathes;
//dijkstra: shortest distance from starting node
function dijkstraInit(start) {
  dijkstra = {};
  visitedNodes = {};
  previousNode = {};
  dijkstra[start] = 0;
  visitedNodes[start] = 1;
}

function setNewShortesPath(nodeId, neighbourId, newDistance) {
  previousNode[neighbourId] = nodeId;
  dijkstra[neighbourId] = newDistance;
}

function shortestPath(nodeId) {
  //set all neighbours as accessable
  Object.keys(nodesObj[nodeId].neighbours).forEach(neighbourId => {
    newDistance =
      dijkstra[nodeId] + nodesObj[nodeId].neighbours[neighbourId].distance;

    //if shortest path to this neighbour is infinity(assume null as infinity)
    if (dijkstra[neighbourId] === undefined)
      setNewShortesPath(nodeId, neighbourId, newDistance);
    else if (dijkstra[neighbourId] > newDistance)
      setNewShortesPath(nodeId, neighbourId, newDistance);
  });

  //find which node to visit and visit it
  nodeToVisit = null;
  newDistance = 0;
  //choose from unvisited nodes which is accassable(dijkstra[id] is not null) and have min distance
  for (let i = 0; i < visitArray.length; i++) {
    if (!dijkstra[i] || visitArray[i]) continue; //if node is not accessable or visited  continue
    //thi node is unvisited and accessable;
    //if node  has min distance  or we havent choosen a node yet, choose it
    if (dijkstra[i] < newDistance || !nodeToVisit) {
      nodeToVisit = i;
      newDistance = dijkstra[i];
    }
  }
  //mark next node as visited
  if (nodeToVisit) {
    visitArray[nodeToVisit] = 1;
    shortestPath(nodeToVisit);
  }
}

export default function dijkstraAction(pathLines) {
  pathes = pathLines;
  // 12-0:13-0: 1
  let start;
  for (let i = 0; i < 40; i++) {
    start = { x: i, y: 0 };
    dijkstraInit(start);
    shortestPath(start);
  }

  return { shortestDistanceToNodes: dijkstra, path: previousNode };
}
