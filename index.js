import "https://cdn.socket.io/4.7.2/socket.io.min.js";

const socketString = 'https://3e9c-2a06-63c0-a01-6800-a0ff-2e5a-f4f2-7814.ngrok-free.app/';
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
var newChatBtn = document.getElementById('newChatBtn');

sendBtn.addEventListener("click",()=>{
    sendMessage();
});

function sendMessage(){
    var textToSend=textarea.value.trim()
    if(textToSend!="")
    {
        var userMsg=document.createElement("div");
        var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        userMsg.classList.add("optiflowz-chat-message-user");
        userMsg.innerHTML=`
        <div>
            <p>${textToSend}</p>
            <span>${time}</span>
        </div>`;
        chatMessages.appendChild(userMsg);
        
        setTimeout(() => {
            scrollToBottom();
            textarea.value = "";
            sendBtn.classList.remove("clickable");
            sendBtn.disabled = true;
        }, 5);

        socket.emit("send_message", {
            sessionID: localStorage.sessionID,
            socketId: socket.id,
            author: 'customer',
            content:  textToSend,
            timeStamp: time
        });
    }
}

window.requestAgent = function() {
    var nameInput = document.querySelector('.optiflowz-chat-form-name');
    var emailInput = document.querySelector('.optiflowz-chat-form-email');
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    if(name == ""){
        nameInput.classList.add("error");
        return;
    }
    else{
        nameInput.classList.remove("error");
    }
    if(email == ""){
        emailInput.classList.add("error");
        return;
    }
    else{
        emailInput.classList.remove("error");
    }
    socket.emit("req_agent", {
        sessionID: localStorage.sessionID,
        name: name,
        email: email
    });
}

window.removeFormFromBody = function(button) {
    chatMessages.removeChild(button.parentElement.parentElement.parentElement);
}

newChatBtn.addEventListener("click",()=>{
    socket.disconnect();
    socket = io(socketString, {
        transports: ['websocket'],
        forceNew: true,
    });
    
    localStorage.clear();

    socket.once("connect", () => {
        window.socket = socket;
        if(localStorage.sessionID == undefined){
            localStorage.setItem("sessionID", socket.id);
        }
        socket.emit('join_room',localStorage.sessionID)
        chatMessages.innerHTML = `
        <div class="optiflowz-chat-message-agent">
            <img src="aiAgentImg.png" alt="Agent Avatar">
            <div>
                    <p>Welcome to the chat! How can I assist you today?</p>
                    <span>16:52</span>
            </div>
        </div>`;
    });

    socket.on('receive_message', (data) => {
        receiveMessage(data)
    });
});

socket.on('receive_message', (data) => {
    receiveMessage(data)
});

var chatBody=document.querySelector('.optiflowz-chat-body')
function scrollToBottom(){
    chatBody.scrollTo(0,chatBody.scrollHeight);
}

function receiveMessage(data){
    if(data.author=='customer' && socket.id != data.socketId){
        var userMsg=document.createElement("div");
        userMsg.classList.add("optiflowz-chat-message-user");
        userMsg.innerHTML=`
        <div>
            <p>${formatMessage(data.content)}</p>
            <span>${data.timeStamp}</span>
        </div>`;
        chatMessages.appendChild(userMsg);

        scrollToBottom();
    }
    if(data.author!='customer'){
        var userMsg=document.createElement("div");
        userMsg.classList.add("optiflowz-chat-message-agent");
        userMsg.innerHTML=`
        <img src="aiAgentImg.png" alt="Agent Avatar">
        <div>
            <p>${data.content}</p>
            <span>${data.timeStamp}</span>
        </div>`;
        chatMessages.appendChild(userMsg);

        scrollToBottom();
    }
}

function formatMessage(text) {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br>');
    formatted = formatted.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    return formatted;
}
 
{
const openChatButton = document.getElementById("optiflowz-chat-open");
const textarea = document.getElementById("optiflowz-chat-textarea");
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

textarea.addEventListener('keydown', (e) => {
    if(e.key.toLocaleLowerCase() == "enter" && !e.shiftKey){
        e.preventDefault();
        sendMessage();
    }
})
textarea.addEventListener('keyup', () => {
    const textToSend = textarea.value.trim();
    if(textToSend != ""){
        sendBtn.classList.add("clickable");
        sendBtn.disabled = false;
    }else{
        sendBtn.classList.remove("clickable");
        sendBtn.disabled = true;
    }
})

window.openOptiFlowzRatingScreen = function() {
    document.querySelector('.optiflowz-rating-wrapper').classList.add('open');
}

window.closeOptiFlowzRatingScreen = function() {
    document.querySelector('.optiflowz-rating-wrapper').classList.remove('open');
}

}