let subworkers = [];
onmessage = function (e) {
  subworkers.forEach(sw => sw.terminate());
  subworkers = [];

  const [pathes, x, y] = JSON.parse(e.data);

  for (let start = 0; start < x; start++) {
    const subWorker = new Worker("./dijkstraSubWorker.js");
    subworkers.push(subWorker);
    subWorker.postMessage([pathes, x, y, start]);
    subWorker.onmessage = e => {
      postMessage(e.data);
      subWorker.terminate();
    };
  }
};
