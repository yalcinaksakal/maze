let subworkers = [];
onmessage = function (e) {
  subworkers.forEach(sw => sw.terminate());
  subworkers = [];

  const [pathes, sizeX, sizeY] = JSON.parse(e.data);
  const indexer = input => [input % sizeX, input >= sizeX ? sizeY - 1 : 0];

  let swNo = Math.min(50, sizeX); // max subworkers working at the same time

  const newSubWorker = (x, y) => {
    const subWorker = new Worker("./dijkstraSubWorker.js");
    subworkers.push(subWorker);
    subWorker.postMessage([sizeX, sizeY, x, y, pathes]);
    subWorker.onmessage = e => {
      postMessage(e.data);
      //work for up and down sides of maze
      if (swNo < 2 * sizeX) {
        //one worker has finished, assign worker with new load
        e.currentTarget.postMessage([sizeX, sizeY, ...indexer(swNo)]);
        swNo++;
      } else subWorker.terminate();
    };
  };

  for (let start = 0; start < swNo; start++) newSubWorker(...indexer(start));
};
