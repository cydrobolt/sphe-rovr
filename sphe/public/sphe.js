var webrtc = new SimpleWebRTC({
  // the id/element dom element that will hold "our" video
  localVideoEl: 'localVideo',
  // the id/element dom element that will hold remote videos
  remoteVideosEl: 'remotesVideos',
  // immediately ask for camera access
  autoRequestMedia: true
});
webrtc.on('readyToCall', function () {
  // you can name it anything
  webrtc.joinRoom('spherovr-token-room' + token);
});
var horn = $("#horn")[0];

var socket = io(location.host);
socket.on('receive_horn', function (data) {
    horn.play();
});

function play_horn() {
    socket.emit('play_horn');
}
