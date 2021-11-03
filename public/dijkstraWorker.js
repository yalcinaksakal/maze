let subworkers = [];

function handleResults(dijkstra, previousNode, startx, starty, sizeX, sizeY) {
  let min = null,
    exit,
    current;
  let path = [];

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

  //if no path return all possible pathes, previousNode
  if (min === null) {
    for (const k of Object.keys(previousNode)) {
      temp = k.split("-");
      path.push({ x: +temp[0], y: +temp[1] });
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
  subworkers.forEach(sw => sw.terminate());
  subworkers = [];

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
      // handleResults(dijkstra, previousNode, startx, starty, sizeX, sizeY)

      postMessage(
        handleResults(dijkstra, previousNode, startx, starty, sizeX, sizeY)
      );

      //work for up and down sides of maze
      if (swNo < 2 * sizeX) {
        //one worker has finished, assign worker with new load
        e.currentTarget.postMessage([...indexer(swNo)]);
        swNo++;
      } else subWorker.terminate();
    };
  };

  for (let start = 0; start < swNo; start++) newSubWorker(...indexer(start));
};
