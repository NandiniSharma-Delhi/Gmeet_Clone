const my_room =() =>{
    // Room_id_for_me=roomId;
    window.open("http://localhost:3030/"+Room_id_for_me);
}
const join_a_new_room = ()=>{
    let input = document.getElementById("meeting_code").value;
    alert("joining meet:"+ input);
    Room_id_for_me=input;
    // window.open("http://localhost:3030/Settings");
    window.open("http://localhost:3030/"+input);
}

const enter = (roomid) =>{
    window.open("http://localhost:3030/"+roomid);
}

const videoelem=document.getElementById("videocam");
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    myVideoStream=stream;
    videoelem.srcObject = stream;
    videoelem.addEventListener('loadedmetadata', () => {
        videoelem.muted=true;
        videoelem.play()
      })
    // videoelem.play();
  }).catch(function(err){
    console.log("eoooo"+err)
  });

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
  