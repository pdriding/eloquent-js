// load dependencies
require("./code/load")("code/hangar2.js", "code/chapter/11_async.js");

let video = new VideoPlayer(clipImages, 100);
video.play().catch(e => {
  console.log("Playback failed: " + e);
});
setTimeout(() => video.stop(), 15000);
