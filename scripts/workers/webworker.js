state = 'idle';
timer = null;

onmessage = function (message) {

  postMessage(`WebWorker: Initial Message: ${message.data}`);
  postMessage(`WebWorker: Starting...`);

  const bc = new BroadcastChannel('wkrp')
  bc.onmessage = function (ev) {
    console.log('onmessage', ev);
    postMessage(`WebWorker: Received Broadcast Message: ${JSON.stringify(ev.data)}`);

    if (ev.data === 'stop') {
      postMessage(`WebWorker: Received Stop Message. Terminating...`);
      state = 'idle';
      bc.close();
      close();

      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (ev.data === 'start-interval') {
      postMessage(`WebWorker: Received Start Interval Message. Starting...`);

      timer = setInterval(() => {
        postMessage(`WebWorker: Timer Tick`);
        runCalculation();
      }, 5000);
    }

    if (ev.data === 'stop-interval') {
      postMessage(`WebWorker: Received Stop Message. Stopping...`);
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (ev.data === 'calculate') {
      postMessage(`WebWorker: Received Calculate Message. Calculating...`);
      state = 'calculating';
      runCalculation();
    }
  }
}

runCalculation = function () {
  let sum = 0;
  let max = 1000000000;
  for (let i = 0; i < max; i++) {
    sum += i;

    if (i % 100000000 === 0) {
      postMessage(`WebWorker: Progress: ${i / max * 100.0}%`);
    }
  }
  postMessage({ sum });
  postMessage(`WebWorker: Completed Successfully.`);
  state = 'idle';
}

onerror = function (ev) {
  console.log('onerror', ev);
  postMessage(`WebWorker: onerror, reason: ${ev}`);
}

onmessageerror = function (ev) {
  console.log('onmessageerror', ev);
  postMessage(`WebWorker: onmessageerror, reason: ${ev}`);
}

oncancel = function (ev) {
  console.log('oncancel', ev);
  postMessage(`WebWorker: oncancel, reason: ${ev}`);
}

onabort = function (ev) {
  console.log('onabort', ev);
  postMessage(`WebWorker: onabort, reason: ${ev}`);
}

// Does not allow control of the worker
// This simple use runs the worker to completion, unless the worker is terminated.
// onmessage = function (message) {
// 
//   postMessage(`WebWorker: Incoming Message: ${message.data}`);
//   postMessage(`WebWorker: Starting...`);
// 
//   let sum = 0;
//   let max = 1000000000;
//   for (let i = 0; i < max; i++) {
//     sum += i;
// 
//     if (i % 100000000 === 0) {
//       postMessage(`WebWorker: Progress: ${i / max * 100.0}%`);
//     }
// 
//     if (x === 100) {
//       break;
//     }
// 
//   }
// 
//   postMessage({ sum });
//   postMessage(`WebWorker: Completed Successfully.`);
// }