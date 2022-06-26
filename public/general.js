
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