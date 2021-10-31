let subworkers = [];
onmessage = function (e) {
  subworkers.forEach(sw => sw.terminate());
  subworkers = [];
  let sx, sy;
  let swNo = 15; //I want max 15 subworkers working at the same time

  const [pathes, sizeX, sizeY] = JSON.parse(e.data);

  const newSubWorker = (startx, starty) => {
    const subWorker = new Worker("./dijkstraSubWorker.js");
    subworkers.push(subWorker);
    subWorker.postMessage([pathes, sizeX, sizeY, startx, starty]);
    subWorker.onmessage = e => {
      postMessage(e.data);
      //work for up and down sides of maze
      if (swNo < 2 * sizeX) {
        sy = swNo >= sizeX ? sizeY - 1 : 0;
        sx = swNo % sizeX;
        //one worker has finished, assign new worker with new load
        newSubWorker(sx, sy);
        swNo++;
      }
      subWorker.terminate();
    };
  };

  for (let start = 0; start < 15; start++) newSubWorker(start, 0);
};
