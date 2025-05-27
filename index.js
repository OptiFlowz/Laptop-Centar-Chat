import "https://cdn.socket.io/4.7.2/socket.io.min.js";

const socketString = 'https://f419-2a06-63c0-a01-6800-2883-fca3-789e-dc95.ngrok-free.app';
var socket;
socket = io(socketString, {
    transports: ['websocket'],
});

// Uspostavljanje konekcije sa soket serverom
socket.once("connect", async () => {
    window.socket = socket;
    if(localStorage.sessionID == undefined){
        localStorage.setItem("sessionID", socket.id);
    }
    else{       
        //Ucitavanje prosle konverzacije
    }
    socket.emit('join_room',localStorage.sessionID)
});

var sendBtn = document.getElementById('optiflowz-chat-send');
var textarea = document.getElementById('optiflowz-chat-textarea');
var chatMessages = document.querySelector('.optiflowz-chat-messages');

sendBtn.addEventListener("click",()=>{
    var textToSend=textarea.value.trim()
    if(textToSend!="")
    {
        var userMsg=document.createElement("div");
        userMsg.classList.add("optiflowz-chat-message-user");
        userMsg.innerHTML=`
        <div>
            <p>${textToSend}</p>
            <span>16:53</span>
        </div>`;
        chatMessages.appendChild(userMsg);
        
        scrollToBottom();

        socket.emit("send_message", {
            sessionID: localStorage.sessionID,
            socketId: socket.id,
            author: 'customer',
            content:  textToSend
        });
    }
});


socket.on('receive_message', (data) => {
    if(data.author=='customer' && socket.id != data.socketId){
        var userMsg=document.createElement("div");
        userMsg.classList.add("optiflowz-chat-message-user");
        userMsg.innerHTML=`
        <div>
            <p>${data.content}</p>
            <span>16:53</span>
        </div>`;
        chatMessages.appendChild(userMsg);

        scrollToBottom();
    }
    if(data.author=='AIServer'){
        var userMsg=document.createElement("div");
        userMsg.classList.add("optiflowz-chat-message-agent");
        userMsg.innerHTML=`
        <img src="Image.png" alt="Agent Avatar">
        <div>
            <p>${data.content}</p>
            <span>16:52</span>
        </div>`;
        chatMessages.appendChild(userMsg);

        scrollToBottom();
    }
});

var chatBody=document.querySelector('.optiflowz-chat-body')
function scrollToBottom(){
    chatBody.scrollTo(0,chatBody.scrollHeight);
}


{
    const openChatButton = document.getElementById("optiflowz-chat-open");
const chat = document.getElementById("optiflowz-chat");
let isOptiFlowzChatOpen = false;
let chatOpenTimeout = setTimeout(() => {}, 150);

if(localStorage.leftChatOpen == 1){
    isOptiFlowzChatOpen=true;
    chat.children[1].style.display = "flex";
        chatOpenTimeout = setTimeout(() => {
            chat.classList.add("chat-open");
            scrollToBottom();
        }, 10);
}

openChatButton.addEventListener("mousedown", () => {
    openChatButton.classList.add("buttonDown");
})
openChatButton.addEventListener("touchstart", () => {
    openChatButton.classList.add("buttonDown");
})

openChatButton.addEventListener("mouseup", () => {
    openChatButton.classList.remove("buttonDown");
})
openChatButton.addEventListener("touchend", () => {
    openChatButton.classList.remove("buttonDown");
})

openChatButton.addEventListener("mouseleave", () => {
    openChatButton.classList.remove("buttonDown");
})
openChatButton.addEventListener("touchcancel", () => {
    openChatButton.classList.remove("buttonDown");
})

openChatButton.addEventListener("click", () => {
    clearTimeout(chatOpenTimeout);
    if(isOptiFlowzChatOpen){
        chat.classList.remove("chat-open");
        localStorage.leftChatOpen = 0;
        chatOpenTimeout = setTimeout(() => {
            chat.children[1].style.display = "none";
        }, 150);
    }else{
        localStorage.leftChatOpen = 1;
        chat.children[1].style.display = "flex";
        chatOpenTimeout = setTimeout(() => {
            chat.classList.add("chat-open");
            scrollToBottom();
        }, 10);
    }
    isOptiFlowzChatOpen = !isOptiFlowzChatOpen;
})
}