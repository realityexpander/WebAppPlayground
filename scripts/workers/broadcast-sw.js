//My service worker...

self.addEventListener('install', (ev) => { });
self.addEventListener('activate', (ev) => { });
self.addEventListener('fetch', (ev) => { });
self.addEventListener('message', (ev) => {
  //message received on port or direct to service worker
});

let channel = new BroadcastChannel('wkrp');

channel.addEventListener('message', (ev) => {
  if (ev && ev.data && ev.data.message) {
    sendBack(`Thanks for the message at ${Date.now()}.`);
  }
});

function sendBack(msg) {
  channel.postMessage({ message: msg });
}