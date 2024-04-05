const es1 = new EventSource('http://localhost:8080/sender/dayeon/receiver/songmin');
const es2 = new EventSource('http://localhost:8080/sender/songmin/receiver/dayeon');
es1.onmessage = (e) => {
    let data = JSON.parse(e.data);

    // console.log("1. event : ", e);       //event object
    // console.log("2. data : ", e.data);   //string
    //console.log("3. data : ", datas);    //객체
    // console.log(data.createdAt);         //string
    // console.log(data.msg);               //string
    // console.log(new Date(data.createdAt).toTimeString().split(' ')[0].slice(0, -3));


    // let time = new Date(data.createdAt).toTimeString().split(' ')[0].slice(0, -3);
    // let date = new Date(data.createdAt).toLocaleDateString().replace(/\./g, '').replace(/\s/g, '-');
    let createdAt = setTimeFormat(data);
    let msg = data.msg;

    //대화 history 불러오기
    setConversations(msg, createdAt, "send");
}
es2.onmessage = (e) => {
    let data = JSON.parse(e.data);
    let createdAt = setTimeFormat(data);
    let msg = data.msg;

    //대화 history 불러오기
    setConversations(msg, createdAt, "receive");
}

//메세지가 보이는 DIV
const chatBox = document.querySelector("#chat-box");
//메세지 보내는 버튼
const sendBtn = document.querySelector("#chat-send");


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
function sendMsg() {
    let inputMsg = document.querySelector("#chat-outgoing-msg");

    chatBox.appendChild(setMsg(inputMsg.value, setTimeFormat(), "send"));
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

//대화 history 불러오기
function setConversations(msg, time, msgType) {

    let msgDiv = setMsg(msg, time, msgType);
    chatBox.appendChild(msgDiv);
}

//메세지 생성시간 format 설정
function setTimeFormat(history) {
    let time = new Date(history.createdAt).toTimeString().split(' ')[0].slice(0, -3);
    let date = new Date(history.createdAt).toLocaleDateString().replace(/\./g, '').replace(/\s/g, '.');

    console.log(date);
    return " " + time + " | " + date;
}