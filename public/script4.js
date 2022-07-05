const socket = io("/");
// import {v4 as uuidv4} from 'uuid';
const videoGrid = document.getElementById("video-grid");
var canvas,
  ctx,
  flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false;
//////////////////
document.getElementById("whiteboard").innerHTML = "<span>WhiteBoard</span>";
document.getElementById("Participants").innerHTML = "<span>Participants</span>";
document.getElementById("main_left_draw").setAttribute("style", "display:none");
document
  .getElementById("main_right_participants")
  .setAttribute("style", "display:none");

//////////////////////////////
var x = "black",
  y = 2;
let but = document.getElementById("screensharebutton");
but.innerText = "ScreenShare";
function randomStr(len, arr) {
  var ans = "";
  for (var i = len; i > 0; i--) {
    ans += arr[Math.floor(Math.random() * arr.length)];
  }
  return ans;
}
const letters = "a1b2c3d4e5f6g7h8i9j0klmnopqrst-uvwxyz";
const myPeer = new Peer(randomStr(20, letters) + " " + Uname);
const peers = {};
const screenpeers = {};
let myVideoStream;

const myVideo = document.createElement("video");
var nmppl = Uname;
myVideo.muted = true;
const closevid = (obj) => {
  if (obj.innerHTML == "<span>WhiteBoard</span>") {
    document
      .getElementById("main_left_vid")
      .setAttribute("style", "display:none");
    document
      .getElementById("main_left_draw")
      .setAttribute("style", "display:block");
    obj.innerHTML = "<span>Go back</span>";
  } else {
    document
      .getElementById("main_left_vid")
      .setAttribute("style", "display:block");
    document
      .getElementById("main_left_draw")
      .setAttribute("style", "display:none");
    obj.innerHTML = "<span>WhiteBoard</span>";
  }
};
const initp = () => {
  canvas = document.getElementById("can");
  ctx = canvas.getContext("2d");
  w = canvas.width;
  h = canvas.height;

  canvas.addEventListener(
    "mousemove",
    function (e) {
      findxy("move", e);
    },
    false
  );
  canvas.addEventListener(
    "mousedown",
    function (e) {
      findxy("down", e);
    },
    false
  );
  canvas.addEventListener(
    "mouseup",
    function (e) {
      findxy("up", e);
    },
    false
  );
  canvas.addEventListener(
    "mouseout",
    function (e) {
      findxy("out", e);
    },
    false
  );
  console.log(":initp done");
};

const color = (obj) => {
  switch (obj.id) {
    case "green":
      x = "green";
      break;
    case "blue":
      x = "blue";
      break;
    case "red":
      x = "red";
      break;
    case "yellow":
      x = "yellow";
      break;
    case "orange":
      x = "orange";
      break;
    case "black":
      x = "black";
      break;
    case "white":
      x = "white";
      break;
  }
  if (x == "white") y = 14;
  else y = 2;
  console.log({ x, y });
};
const erase = () => {
  var m = confirm("Want to clear");
  if (m) {
    ctx.clearRect(0, 0, w, h);
    document.getElementById("canvasimg").style.display = "none";
  }
};

const save = () => {
  // document.getElementById("canvasimg").style.border = "2px solid";
  var dataURL = canvas.toDataURL();
  document.getElementById("canvasimg").src = dataURL;
  document.getElementById("canvasimg").style.display = "inline";
};

socket.on(
  "ondraw",
  ({ x: x, y: y, prevX: prevX, prevY: prevY, currX: currX, currY: currY }) => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
    console.log("ondraw done");
  }
);

const findxy = (res, e) => {
  if (res == "down") {
    prevX = currX;
    prevY = currY;
    currX = e.clientX - canvas.offsetLeft;
    currY = e.clientY - canvas.offsetTop;
    flag = true;
    dot_flag = true;
    if (dot_flag) {
      socket.emit("down", {
        x: x,
        y: y,
        prevX: prevX,
        prevY: prevY,
        currX: currX,

        currY: currY,
      });
      dot_flag = false;
    }
  }
  if (res == "up" || res == "out") {
    flag = false;
  }
  if (res == "move") {
    if (flag) {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - canvas.offsetLeft;
      currY = e.clientY - canvas.offsetTop;
      // draw();
      socket.emit("draw", {
        x: x,
        y: y,
        prevX: prevX,
        prevY: prevY,
        currX: currX,
        currY: currY,
      });
    }
  }
};

socket.on(
  "ondown",
  ({ x: x, y: y, prevX: prevX, prevY: prevY, currX: currX, currY: currY }) => {
    ctx.beginPath();
    ctx.fillStyle = x;
    ctx.fillRect(currX, currY, 2, 2);
    ctx.closePath();
    console.log("ondown done");
  }
);

const sendmsg = () => {
  let textp = document.getElementById("chat_message");
  if (textp.value) {
    socket.emit("message", textp.value, Uname);
    textp.value = "";
  }
};

const Ileave = () => {
  window.open("http://localhost:3030/Ended", "_self");
};
//////////////////////////closechat
const closechat = (obj) => {
  if (obj.innerHTML == "<span>Participants</span>") {
    document
      .getElementById("main_right_chat")
      .setAttribute("style", "display:none");
    document
      .getElementById("main_right_participants")
      .setAttribute("style", "display:block");
    obj.innerHTML = "<span>Chat</span>";
    let parti = document.getElementById("persons");
    parti.innerHTML =
      "<li class='personme'>" + myPeer.id.split(" ")[1] + "</li>";
    for (var person in screenpeers) {
      var arr = person.split(" ");
      console.log("hogya");
      parti.innerHTML += "<li class='personme'>" + arr[1] + "</li>";
    }
  } else {
    document
      .getElementById("main_right_chat")
      .setAttribute("style", "display:block");
    document
      .getElementById("main_right_participants")
      .setAttribute("style", "display:none");
    obj.innerHTML = "<span>Participants</span>";
  }
};

//////////////////////////////////////////////////
socket.on("createMessage", (message, Uname1) => {
  document.getElementById("messages").innerHTML +=
    "<li class='message'><b>" + `${Uname1}` + `</b><br/>${message}</li>`;
  scrollToBottom();
});
// socket.on("sentname",()=>{

// });
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    // addVideoStream(myVideo,stream,Uname,mydiv,mybody,myfooter);
    myVideo.setAttribute("title", Uname);
    myVideo.id = myPeer.id;
    addVideoStream(myVideo, stream);
    myPeer.on("call", (call) => {
      call.answer(stream);
      let yourname = call.metadata.myname;
      screenpeers[call.metadata.userId] = call;
      const video = document.createElement("video");
      video.setAttribute("title", yourname);
      video.id = call.metadata.userId;
      call.on("stream", (userVideoStream) => {
        // socket.emit("");
        // addVideoStream(video, userVideoStream,Uname,mydiv,mybody,myfooter)
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
    // input value
    /////////////////////mgs
    // let text = $("input");
    // $('html').keydown(function (e) {
    //   if (e.which == 13 && text.val().length !== 0) {
    //     socket.emit('message', text.val(),Uname);
    //     text.val('')
    //   }
    // });

    ///////////////////////////////
    ///////////////////screenshare//////////
    but.onclick = function () {
      if (but.innerText == "ScreenShare") {
        navigator.mediaDevices
          .getDisplayMedia({
            video: true,
          })
          .then((stream2) => {
            myVideoStream = stream2;
            // myVideo.srcObject=stream2;
            let videoTrack = myVideoStream.getVideoTracks()[0];
            for (var person in screenpeers) {
              let sender = screenpeers[person].peerConnection
                .getSenders()
                .find(function (s) {
                  return s.track.kind == videoTrack.kind;
                });
              sender.replaceTrack(videoTrack);
            }
            stream2.getVideoTracks()[0].addEventListener("ended", () => {
              let videoTrack = stream.getVideoTracks()[0];
              myVideoStream = stream;

              for (var person in screenpeers) {
                let sender = screenpeers[person].peerConnection
                  .getSenders()
                  .find(function (s) {
                    return s.track.kind == videoTrack.kind;
                  });
                sender.replaceTrack(videoTrack);
              }

              // myVideoStream.getTracks().forEach(function (track) {
              //     track.stop();
              // });
              but.innerText = "ScreenShare";
            });
            but.innerText = "Stop Share";
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        let videoTrack = stream.getVideoTracks()[0];
        myVideoStream = stream;

        for (var person in screenpeers) {
          let sender = screenpeers[person].peerConnection
            .getSenders()
            .find(function (s) {
              return s.track.kind == videoTrack.kind;
            });
          sender.replaceTrack(videoTrack);
        }

        // myVideoStream.getTracks().forEach(function (track) {
        //     track.stop();
        // });
        but.innerText = "ScreenShare";
      }
    };
    //////////////////////////////////////canvas//

    ///////////////////////
  })
  .catch((err) => {
    console.log("camera not connected");
    console.log(err);
    /////////////////////////

    ////////////////////////
  });
socket.on("user-disconnected", (userId) => {
  if (peers[userId]) {
    peers[userId].close();
    document.getElementById(userId).remove();
    delete peers[userId];
  }
  if (screenpeers[userId]) {
    screenpeers[userId].close();
    document.getElementById(userId).remove();
    delete screenpeers[userId];
  }
});

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
  // socket.emit("myname",Uname);
});

// socket.on("newname",(name)=>{
//   nmppl=name;
// });

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream, {
    metadata: { myname: Uname, userId: myPeer.id },
  });
  // let arry=call.metadata.myname;
  let arry = userId.split(" ");
  const video = document.createElement("video");
  video.setAttribute("title", arry[1]);
  video.id = userId;
  call.on("stream", (userVideoStream) => {
    // addVideoStream(video, userVideoStream,mydiv,mybody,myfooter)
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    // myVideo.remove()
  });

  peers[userId] = call;
  screenpeers[userId] = call;
}

function addVideoStream(video, stream) {
  // video.setAttribute("title",unp);
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
function addVideoStreamnull(video) {
  // video.setAttribute("title",unp);
  // video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

const scrollToBottom = () => {
  var d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const playStop = () => {
  console.log("object");
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};
