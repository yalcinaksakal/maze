let subworkers = [];
let startOfNoPaths, nodesOfNoPaths, dones;

const init = () => {
  startOfNoPaths = new Set();
  nodesOfNoPaths = new Set();
  dones = {};
};

const pathCreator = (
  exit,
  outY,
  startx,
  starty,
  sizeX,
  sizeY,
  previousNode
) => {
  const path = [];
  const pathes = [];
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
    //if previous nodes include neighbours of same row mark them as done too
    if (y !== starty) continue;
    if (!dones[`${x}-${y}`]) {
      dones[`${x}-${y}`] = 1;
      pathes.push({
        path: [{ x, y: starty ? sizeY : -1 }, ...path],
        direction: starty ? "down" : "up",
        doesPathExist: true,
      });
    }
  }
  path.unshift({ x, y: starty ? sizeY : -1 });
  pathes.push({ path, direction: starty ? "down" : "up", doesPathExist: true });
  return pathes;
};

function handleResults(dijkstra, previousNode, startx, starty, sizeX, sizeY) {
  let min = null,
    exit,
    current;

  //mark node as done
  dones[`${startx}-${starty}`] = 1;

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

  //if no path return all possible pathes, previousNode
  if (min === null) {
    return [];
    //   for (const k of Object.keys(previousNode)) {
    //     temp = k.split("-");
    //     path.push({ x: +temp[0], y: +temp[1] });
    //   }
    //   doesPathExist = false;
    //   return {
    //     path,
    //     direction: starty ? "down" : "up",
    //     doesPathExist,
    //   };
  }

  // crete pathes from previousnodes nd return it
  return pathCreator(exit, outY, startx, starty, sizeX, sizeY, previousNode);
}

onmessage = function (e) {
  subworkers.forEach(sw => sw.terminate());
  subworkers = [];
  init();
  const [pathes, sizeX, sizeY] = e.data;
  const indexer = input => [input % sizeX, input >= sizeX ? sizeY - 1 : 0];

  let swNo = Math.min(50, sizeX); // max subworkers working at the same time

  const newSubWorker = (x, y) => {
    const subWorker = new Worker("./dijkstraSubWorker.js");
    subworkers.push(subWorker);
    subWorker.postMessage([x, y, pathes]);
    subWorker.onmessage = e => {
      //e.data=
      // dijkstra,
      // previousNode,
      // startx,
      // starty,
      // console.log(e.data);
      const { dijkstra, previousNode, startx, starty } = e.data;

      if (!dones[`${startx}-${starty}`])
        postMessage(
          handleResults(dijkstra, previousNode, startx, starty, sizeX, sizeY)
        );
      let newx = startx,
        newy = starty;
      while (dones[`${newx}-${newy}`] && swNo < 2 * sizeX) {
        newy = indexer(swNo);
        newx = newy[0];
        newy = newy[1];
        swNo++;
      }
      //work for up and down sides of maze
      if (!dones[`${newx}-${newy}`] && swNo <= 2 * sizeX) {
        //one worker has finished, assign worker with new load
        e.currentTarget.postMessage([newx, newy]);
      } else subWorker.terminate();
    };
  };

  for (let start = 0; start < swNo; start++) newSubWorker(...indexer(start));
};
