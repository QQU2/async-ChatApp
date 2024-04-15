let usrNm = prompt("아이디 : ");
let roomNum = prompt("채팅방 번호 : ");

//메세지가 보이는 DIV
const chatBox = document.querySelector("#chat-box");
//메세지 보내는 버튼
const sendBtn = document.querySelector("#chat-send");

const es1 = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);
// const es2 = new EventSource('http://localhost:8080/sender/songmin/receiver/dayeon');
es1.onmessage = (e) => {
    let data = JSON.parse(e.data);
    
    let msg       = data.msg;
    let createdAt = setTimeFormat(data);
    let action    = (data.sender === usrNm) ? "send" : "receive";

    chatBox.appendChild(setMsg(msg, createdAt, action));
}


/******* 이벤트 설정 *******/

//1. 보내기 버튼을 누르면 메세지 보내기
sendBtn.addEventListener("click", () => { sendMsg(); });
//2. 엔터 누르면 메세지 보내기
document.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        sendMsg();
    }
});
/******** 이벤트 설정 ********/


/******** 함수 구현 *********/
//메세지 보내기
async function sendMsg() {
    let inputMsg = document.querySelector("#chat-outgoing-msg");

    let chat = {
        sender: usrNm,
        roomNum: roomNum,
        msg: inputMsg.value
    };

    await fetch("http://localhost:8080/chat"
        , {
            method: "post",
            body: JSON.stringify(chat),
            headers: {
                "Content-Type": "application/json; charset=utf-8"   //MIME 타입
            }
        }
    );

    inputMsg.value = "";
}

//하나의 메세지 UI요소 만들기
function setMsg(message, sendTime, msgType) {
    let msgDiv = document.createElement("div");

    //보내는 메시지일 때
    if (msgType == 'send') {
        msgDiv.setAttribute("class", "outgoing_msg");

        msgDiv.innerHTML =
            `<div class="sent_msg">
            <p>${message} </p>
            <span class="time_date">${sendTime}</span>
            </div>
            `;
    }
    //받는 메시지일 때
    else {
        msgDiv.setAttribute("class", "incoming_msg");

        msgDiv.innerHTML =
            `<div class="received_msg">
                <div class="received_withd_msg">
                  <p>${message} </p>
                  <span class="time_date">${sendTime}</span>
                </div>
              </div>
        `;
    }

    return msgDiv;
}

//메세지 생성시간 format 설정
function setTimeFormat(history) {

    let time = new Date(history.createdAt).toTimeString().split(' ')[0].slice(0, -3);
    let date = new Date(history.createdAt).toLocaleDateString().replace(/\./g, '').replace(/\s/g, '.');

    return " " + time + " | " + date;
}