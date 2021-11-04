let subworkers = [];
let nodesOfNoPaths, remainings;

const reverseIndexer = (x, y, size) => x + (y > 0 ? size : 0);

const init = x => {
  subworkers.forEach(sw => sw.terminate());
  subworkers = [];
  nodesOfNoPaths = {};
  remainings = Array.from(Array(2 * x).keys());
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
    temp = reverseIndexer(x, y, sizeX);
    if (remainings[temp] !== -1) {
      remainings[temp] = -1;
      // path.push()
      pathes.push({
        path: [{ x, y: starty ? sizeY : -1 }, path[0]],
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

  remainings[reverseIndexer(startx, starty, sizeX)] = -1;
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
    const dir = starty ? 1 : -1;
    let length = 1;
    nodesOfNoPaths[`${startx}-${starty}`] = dir;
    for (const k of Object.keys(previousNode)) {
      current = k.split("-");
      nodesOfNoPaths[k] = dir;
      //  //if previous nodes include neighbours of same row mark them as done too
      if (+current[1] !== starty) continue;
      length++;
      current = reverseIndexer(+current[0], +current[1], sizeX);
      remainings[current] = -1;
    }
    return { length, type: "noPaths" };
  }

  // crete pathes from previousnodes nd return it
  return pathCreator(exit, outY, startx, starty, sizeX, sizeY, previousNode);
}

onmessage = function (e) {
  const [pathes, sizeX, sizeY] = e.data;
  init(sizeX);

  const indexer = input => [input % sizeX, input >= sizeX ? sizeY - 1 : 0];

  const pickRandomly = () => {
    const pickList = remainings.filter(e => e !== -1);
    const pick = pickList[Math.floor(Math.random() * pickList.length)];
    const [newx, newy] = indexer(pick);

    remainings[pick] = -1;
    return [newx, newy];
  };

  let swNo = Math.ceil(sizeX / 3); // max subworkers working at the same time

  const newSubWorker = (x, y) => {
    const subWorker = new Worker("./dijkstraSubWorker.js");
    subworkers.push(subWorker);
    subWorker.postMessage([x, y, pathes]);
    subWorker.onmessage = e => {
      const { dijkstra, previousNode, startx, starty } = e.data;
      postMessage(
        handleResults(dijkstra, previousNode, startx, starty, sizeX, sizeY)
      );

      if (swNo < 2 * sizeX) {
        swNo++;
        e.currentTarget.postMessage(pickRandomly());
      } else subWorker.terminate();
    };
  };

  for (let start = 0; start < swNo; start++) newSubWorker(...pickRandomly());
};
