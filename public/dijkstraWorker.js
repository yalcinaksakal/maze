let subworkers = [];
onmessage = function (e) {
  subworkers.forEach(sw => sw.terminate());
  subworkers = [];

  let swNo = 20; //I want max subworkers working at the same time

  const [pathes, sizeX, sizeY] = JSON.parse(e.data);
  const indexer = input => ({
    y: input >= sizeX ? sizeY - 1 : 0,
    x: input % sizeX,
  });

  const newSubWorker = point => {
    const subWorker = new Worker("./dijkstraSubWorker.js");
    subworkers.push(subWorker);
    subWorker.postMessage([pathes, sizeX, sizeY, point.x, point.y]);
    subWorker.onmessage = e => {
      postMessage(e.data);
      //work for up and down sides of maze
      if (swNo < 2 * sizeX) {
        //one worker has finished, assign new worker with new load
        newSubWorker(indexer(swNo));
        swNo++;
      }
      subWorker.terminate();
    };
  };

  for (let start = 0; start < swNo; start++) newSubWorker(indexer(start));
};
