var currentIteration = 0;
var settings = { id: "NO-ID-ASSIGNED" };
var isRunning = false;

let listener = self.addEventListener('message', (ev) => {
  console.log(`worker2.js got message ${JSON.stringify(ev)}`);

  if (ev.data.command === 'start') {
    postMessage('worker2.js: WebWorker2 Started.');
    // postMessage('page_web_worker: WebWorker Ready.');

    isRunning = true;
    currentIteration = 0;
    settings = ev.data.payload;
  }

  if (ev.data.command === 'pause') {
    postMessage('worker2.js: WebWorker2 pausing...');
    isRunning = false;
  }

  if (ev.data.command === 'resume') {
    postMessage('worker2.js: WebWorker2 resuming...');
    isRunning = true;
  }
}, false);

// Fibonacci number generator
function* fibonacci_fast(x) {
  // Fast implementation
  // let [prev, curr] = [0, 1];
  // while (true) {
  //   [prev, curr] = [curr, prev + curr];
  //   yield curr;
  // }
}

function fibonacci(x) {
  // Slow implementation
  if (x < 2) return x;
  return fibonacci(x - 1) + fibonacci(x - 2);
}


// send messages with Fibonacci numbers and task string
setInterval(function () {
  if (isRunning == false) return;

  const messageString = fibonacci(++currentIteration) + " - " + settings.id;
  console.log("worker2 message: " + messageString);
  postMessage(messageString);

  // reportError("error")
}, 500);

onerror = function (ev) {
  console.log('onerror', ev);
  postMessage(`worker2: onerror, reason: ${ev}`);
}

onmessageerror = function (ev) {
  console.log('onmessageerror', ev);
  postMessage(`worker2: onmessageerror, reason: ${ev}`);
}

oncancel = function (ev) {
  console.log('oncancel', ev);
  postMessage(`worker2: oncancel, reason: ${ev}`);
}

onabort = function (ev) {
  console.log('onabort', ev);
  postMessage(`worker2: onabort, reason: ${ev}`);
}