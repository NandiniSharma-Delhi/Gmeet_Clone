const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const screenGrid = document.getElementById('screen-grid');  ////
// let but = document.getElementById("screensharebutton");
// const myPeer = new Peer(undefined, {
//   path: '/peerjs',
//   host: '/',
//   port: '443'
// })
const myPeer = new Peer();

let myVideoStream;
let myScreenStream; ////

const myVideo = document.createElement('video')
const myScreen=document.createElement('video')
myScreen.id="screenelement";
myVideo.muted = true;
myScreen.muted=true;
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream1 => {
    myVideoStream=stream1;
    navigator.mediaDevices.getDisplayMedia({
        video:true,
        audio:true
    }).then(stream2 =>{
        myScreenStream=stream2;
        addVideoStream(myVideo, stream1)
        addScreenStream(myScreen, stream2)
        myPeer.on('call', call => {
            call.answer(stream)
            const video = document.createElement('video')
            call.on('stream', userVideoStream => {
              addVideoStream(video, userVideoStream)
            })
        })
          
        
          socket.on('user-connected', userId => {
            connectToNewUser(userId, stream)
          })
        //both call

    }).catch((err)=>{
        console.log(err);
        myScreenStream=null;
        //videoonly
    });

}).catch((err)=>{
    console.log(err);
    myVideoStream=null;
    navigator.mediaDevices.getDisplayMedia({
        video:true,
        audio:true
    }).then(stream2 =>{
        myScreenStream=stream2;
        //screen only
    }).catch((err)=>{
        console.log(err);
        myScreenStream=null;
        //none
    });

})

/////////////////////////message

  // when press enter send message
  $('html').keydown(function (e) {
    let text = $("input");
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
//   const screenfunc=()=>{

//     socket.emit('screenshare')
//   }
  socket.on("createMessage", message => {
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
  });
//////////////////////////////////



///////////////////////screeenshare
but.onclick=function(){
  
  if(but.innerText=="ScreenShare"){
    const mySc = new Peer();
      navigator.mediaDevices.getDisplayMedia({
          // video: {  
          //   mediaSource: "screen",  
          //   // width: { max: '1920' },  
          //   // height: { max: '1080' },   
          //   frameRate: { max: '10' }  
          // }  ,
          video:true,
          audio: true
        }).then(stream =>{
          myScreenStream=stream;
          addScreenStream(myScreen,stream)
          
          console.log(stream);
          socket.emit('screenshare', stream);
          

          but.innerText="Stop Share";
        }).catch((err)=>{
          console.log(err);
        })
  }else{
      let screenvideo=document.getElementById("screenelement");
      console.log("inside")
      socket.emit('screenstop', screenvideo);
      
      but.innerText="ScreenShare";

      
  }
  
};
socket.on("StopScreen", (ele) => {
  // $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
  // scrollToBottom()
  // addScreenStream(myScreen,stream);
  console.log("now removing");
  ele.remove();
  // ele.innerText="Stop Share";
});
socket.on("createScreen", (stream) => {
  // $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
  // scrollToBottom()
  console.log("inside createScreen");
  console.log(stream);
  try{addScreenStream(myScreen,stream);}
  catch (e){
    console.log(e);
  }
})
//////////////////////////////////////////////
































socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}
function addScreenStream(video, stream) {
  console.log(stream);
    // video.src = window.URL.createObjectURL(stream);
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    screenGrid.append(video)
}



const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}
