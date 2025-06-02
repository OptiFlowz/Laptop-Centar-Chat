import "https://cdn.socket.io/4.7.2/socket.io.min.js";

const socketString = 'https://5fe1-2a06-63c0-a01-6800-e978-6bcf-a5f-2ebb.ngrok-free.app';
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
        loadChatHistory(localStorage.sessionID, false);
    }
    socket.emit('join_room', {
        sessionID: localStorage.sessionID
    })
});

var sendBtn = document.getElementById('optiflowz-chat-send');
var textarea = document.getElementById('optiflowz-chat-textarea');
var chatMessages = document.querySelector('.optiflowz-chat-messages');
var newChatBtn = document.getElementById('optiflowz-chat-new-chat');
var rejoinBtn = document.getElementById('optiflowz-chat-rejoin-button');

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
            timeStamp: time,
            bot: true
        });
    }
}

document.getElementById("optiflowz-chat-request-agent").addEventListener("click", () => {
    document.querySelector('.optiflowz-chat-form').classList.add('open');
});

window.closeOptiFlowzAgentForm = function() {
    document.querySelector('.optiflowz-chat-form').classList.remove('open');
}

document.getElementById("optiflowz-chat-request-agent-button").addEventListener("click", () => {
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
});

newChatBtn.addEventListener("click",()=>{
    socket.disconnect();
    socket = io(socketString, {
        transports: ['websocket'],
        forceNew: true,
    });
    
    localStorage.sessionID = null;

    socket.once("connect", () => {
        window.socket = socket;
        localStorage.setItem("sessionID", socket.id);
        socket.emit('join_room', {
            sessionID: localStorage.sessionID
        })
        var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        chatMessages.innerHTML = `
        <div class="optiflowz-chat-message-agent">
            <img src="aiAgentImg.png" alt="Agent Avatar">
            <div>
                    <p>Zdravo! Kako mogu da Vam pomognem danas?</p>
                    <span>${time}</span>
            </div>
        </div>`;
    });

    document.querySelector('.optiflowz-chat-header img').src = "aiAgentImg.png";
    document.querySelector('.optiflowz-chat-header h1').innerHTML = "AI AGENT";

    socket.on('receive_message', (data) => {
        receiveMessage(data)
    });
});

rejoinBtn.addEventListener("click", () => {
    let sessionID = document.querySelector('.optiflowz-chat-rejoin-code').value.trim();
    if(sessionID == ""){
        document.querySelector('.optiflowz-chat-rejoin-code').classList.add("error");
        return;
    }

    if(!loadChatHistory(sessionID, true)){
        return;
    }

    localStorage.sessionID = null;
    socket.emit('join_room', {
        sessionID: sessionID
    })
    localStorage.setItem("sessionID", sessionID);

    closeOptiFlowzRejoinForm();
})

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
 
async function loadChatHistory(ssID, rejoin) {
    let chatHistory = await load_convo(ssID);
    console.log(chatHistory);
    if (!chatHistory.convo[0].conversation[0].Content){
        if(rejoin){
            document.querySelector('.optiflowz-chat-rejoin-code').classList.add("error");
        }
        return;
    }

    chatMessages.innerHTML = ''; // Clear existing messages
    chatHistory.convo[0].conversation.forEach(message => {
        let messageElement = document.createElement("div");
        if (message.Sender === 's') {
            messageElement.classList.add("optiflowz-chat-message-user");
        } else if( message.Sender === 'a') {
            messageElement.classList.add("optiflowz-chat-message-agent");
            messageElement.innerHTML = `<img src="${chatHistory.convo[0].Agent.Image}" alt="Agent Avatar">`;
        }
        else {
            messageElement.classList.add("optiflowz-chat-message-agent");
            messageElement.innerHTML = `<img src="aiAgentImg.png" alt="Agent Avatar">`;
        }

        let messageTime = new Date(Number(message.Time)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

        messageElement.innerHTML += `
            <div>
                <p>${formatMessage(message.Content)}</p>
                <span>${messageTime}</span>
            </div>`;
        chatMessages.appendChild(messageElement);
    })

    if(chatHistory.convo[0].Agent && chatHistory.convo[0].Agent.Image) {
        document.querySelector('.optiflowz-chat-header img').src = chatHistory.convo[0].Agent.Image;
        document.querySelector('.optiflowz-chat-header h1').innerHTML = chatHistory.convo[0].Agent.Name;
    }else{
        document.querySelector('.optiflowz-chat-header img').src = "aiAgentImg.png";
        document.querySelector('.optiflowz-chat-header h1').innerHTML = "AI AGENT";
    }

    scrollToBottom();
}

async function load_convo(ssID) {
    return new Promise((resolve, reject) => {
      socket.emit('load_convo',{ sessionID: ssID},(convo, err) => {
          if (err) 
            return reject(err);
          resolve(convo);
        }
      );
    });
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

document.getElementById("optiflowz-chat-rating").addEventListener("click", () => {
    document.querySelector('.optiflowz-rating-wrapper').classList.add('open');
});

window.closeOptiFlowzRatingScreen = function() {
    document.querySelector('.optiflowz-rating-wrapper').classList.remove('open');
}

// REJOIN

document.getElementById("optiflowz-chat-rejoin").addEventListener("click", () => {
    document.querySelector('.optiflowz-chat-form-rejoin').classList.add('open');
});

window.closeOptiFlowzRejoinForm = function() {
    document.querySelector('.optiflowz-chat-form-rejoin').classList.remove('open');
}

document.getElementById("optiflowz-chat-more").addEventListener("click", () => {
    document.querySelector("#optiflowz-chat-more div").classList.toggle("open");
})

window.setSelected = function(button, parent) {
    const buttons = parent.querySelectorAll("button");
    buttons.forEach(btn => {
        btn.classList.remove("selected");
    });
    button.classList.add("selected");
}

document.getElementById("optiflowz-chat-rate-button").addEventListener("click", () => {
    const selectedButton = document.querySelector('.optiflowz-rating-content .optiflowz-rating-buttons button.selected');
    if (selectedButton) {
        const rating = selectedButton.getAttribute("data-rating");
        socket.emit("rate", {
            sessionID: localStorage.sessionID,
            rating: rating
        });
        closeOptiFlowzRatingScreen();
    }
});

}