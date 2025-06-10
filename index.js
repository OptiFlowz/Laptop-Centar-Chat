import "https://cdn.socket.io/4.7.2/socket.io.min.js";

const socketString = 'https://9860-2a06-63c0-a01-6800-45b8-e917-8238-1056.ngrok-free.app/';
var socket;
socket = io(socketString, {
    transports: ['websocket'],
});

// Uspostavljanje konekcije sa soket serverom
socket.once("connect", async () => {
    window.socket = socket;
    if(localStorage.sessionID == undefined){
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
        addQuestionsToChat();
    }
    else{
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
        let newQuestionHolder = document.createElement("div");
        newQuestionHolder.classList.add("questions");
        chatMessages.appendChild(newQuestionHolder);
        addQuestionsToChat();

        //Ucitavanje prosle konverzacije
        try {
            await loadChatHistory(localStorage.sessionID, false);

            socket.emit('sync_typers', { sessionID: localStorage.sessionID}, (data, err) => {
                setTimeout(() => {
                    if(data.roomTypers[0] != undefined && data.roomTypers[0] != "s"){
                        let stepElement = document.createElement("div");
                        stepElement.classList = "optiflowz-chat-message-agent optiflowz-typing-indicator";
                        stepElement.innerHTML = `
                        <img src="${currentAgentIcon}" alt="AI Agent Avatar">
                        <div>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>`;
                        chatMessages.appendChild(stepElement);
                        lastStep = stepElement;
                        scrollToBottom();
                    }
                }, 50);
            });
        } catch {}
    }
});

var sendBtn = document.getElementById('optiflowz-chat-send');
var textarea = document.getElementById('optiflowz-chat-textarea');
var chatMessages = document.querySelector('.optiflowz-chat-messages');
var newChatBtn = document.getElementById('optiflowz-chat-new-chat');
var rejoinBtn = document.getElementById('optiflowz-chat-rejoin-button');
var requestBtn = document.getElementById("optiflowz-chat-request-agent");
var currentAgentIcon = "aiAgentImg.png";

sendBtn.addEventListener("click",()=>{
    sendMessage();
});

function sendMessage(){
    var textToSend=textarea.value.trim()
    if(textToSend!="")
    {
        removeQuestionsFromChat();
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

requestBtn.addEventListener("click", () => {
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

    callErrorPopup("Agent će biti uskoro sa Vama!");
    closeOptiFlowzAgentForm();
    waitingForAgent = true;
    requestBtn.classList.add("chat-displayNone");
    opAgentConnectingText(0);
});

let waitingForAgent = false;
function opAgentConnectingText(i){
    if(!waitingForAgent)
        return;

    document.querySelector('.optiflowz-chat-header h1').innerHTML = "Čeka se agent";
    for (let j = 0; j < i; j++) {
        document.querySelector('.optiflowz-chat-header h1').innerHTML += ".";
    }
    setTimeout(() => {
        if(i > 2)
            i = 0;
        opAgentConnectingText(i+1);
    }, 333.33);
}

function finishConversationOptiFlowz(params) {
    return new Promise((resolve, reject) => {
      socket.emit('finish',{ sessionID: localStorage.sessionID },(res, err) => {
          if (err){
            callErrorPopup(err.error);
            return reject(err.success);
          }
          resolve(res);
        }
      );
    });
}

newChatBtn.addEventListener("click", async () => {

    let da = await finishConversationOptiFlowz();

    socket.disconnect();
    socket = io(socketString, {
        transports: ['websocket'],
        forceNew: true,
    });
    
    localStorage.removeItem("sessionID");

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
        addQuestionsToChat();
    });

    waitingForAgent = false;
    requestBtn.classList.remove("chat-displayNone");

    document.querySelector('.optiflowz-chat-header img').src = "aiAgentImg.png";
    currentAgentIcon = "aiAgentImg.png";
    document.querySelector('.optiflowz-chat-header h1').innerHTML = "AI AGENT";

    socket.on('receive_message', (data) => {
        receiveMessage(data)
    });

    socket.on('session_state', (data) => {
        if(data.isFinished){
            callErrorPopup("Conversation was finished by an agent!");
        }
        if(data.isBotChat == false && data.isAgentOn == false){
            waitingForAgent = true;
            requestBtn.classList.add("chat-displayNone");
            opAgentConnectingText(0);
        }else{
            requestBtn.classList.remove("chat-displayNone");
            waitingForAgent = false;
        }
    });

    socket.on('agent_connected', (data) => {
        waitingForAgent = false;
        document.querySelector('.optiflowz-chat-header img').src = data.PhotoURL;
        currentAgentIcon = data.PhotoURL;
        document.querySelector('.optiflowz-chat-header h1').innerHTML = data.Name;
    });

    socket.on('agent_finished', (data) => {
        callErrorPopup("Agent je završio konverzaciju");
    });

    socket.on('error', (data) => {
        if(data.content == "Can't load finished session"){
            closeOptiFlowzRejoinForm();
        }
        callErrorPopup(data.content);
    });

    socket.on('user_typing', (data) => {
        if(data.userID != "s"){
            let stepElement = document.createElement("div");
            stepElement.classList = "optiflowz-chat-message-agent optiflowz-typing-indicator";
            stepElement.innerHTML = `
            <img src="${currentAgentIcon}" alt="AI Agent Avatar">
            <div>
                <span></span>
                <span></span>
                <span></span>
            </div>`;
            chatMessages.appendChild(stepElement);
            lastStep = stepElement;
            scrollToBottom();
        }
    });

    socket.on('step', (data) => {
        if(data == "typing"){
            let stepElement = document.createElement("div");
            stepElement.classList = "optiflowz-chat-message-agent optiflowz-typing-indicator";
            stepElement.innerHTML = `
            <img src="${currentAgentIcon}" alt="AI Agent Avatar">
            <div>
                <span></span>
                <span></span>
                <span></span>
            </div>`;
            chatMessages.appendChild(stepElement);
            lastStep = stepElement;
            scrollToBottom();
        }
        else{
            if(lastStep){
                chatMessages.removeChild(lastStep);
                lastStep = null;
            }
            let stepElement = document.createElement("div");
            stepElement.classList = "optiflowz-chat-message-agent optiflowz-typing-indicator";
            stepElement.innerHTML = `
            <img src="${currentAgentIcon}" alt="AI Agent Avatar">
            <div>
                <span></span>
                <span></span>
                <span></span>
                <p>${data}</p>
            </div>`;
            chatMessages.appendChild(stepElement);
            lastStep = stepElement;
            scrollToBottom();
        }
    });

    socket.on('user_stop_typing', (data) => {
        if(data.userID == "a" && lastStep){
            chatMessages.removeChild(lastStep);
            lastStep = null;
        }
    })
});

function addQuestionsToChat(){
    removeQuestionsFromChat();
    let newQuestionHolder = document.createElement("div");
    newQuestionHolder.classList.add("questions");
    chatMessages.appendChild(newQuestionHolder);
    for (let i = 0; i < 2; i++) {
        let newQuestion = document.createElement("div");
        if(i == 0){
            newQuestion.innerHTML = "Za koliko mi stiže porudžbina?";
        }else{
            newQuestion.innerHTML = "Da li imate ____ na stanju?";
        }
        newQuestion.addEventListener("click", () => {
            textarea.value = newQuestion.innerHTML;
            sendMessage();
        })
        newQuestionHolder.appendChild(newQuestion);
    }
}

function removeQuestionsFromChat(){
    let questions = chatMessages?.querySelector(".questions");
    if(questions){
        chatMessages.removeChild(questions);
    }
}

rejoinBtn.addEventListener("click", async () => {
    let sessionID = document.querySelector('.optiflowz-chat-rejoin-code').value.trim();
    if(sessionID == ""){
        document.querySelector('.optiflowz-chat-rejoin-code').classList.add("error");
        return;
    }

    try {
        var chatHistoryPromise = await loadChatHistory(sessionID, true);
        if(!chatHistoryPromise){
            return;
        }

        localStorage.removeItem("sessionID");
        socket.emit('join_room', {
            sessionID: sessionID
        })
        localStorage.setItem("sessionID", sessionID);

        closeOptiFlowzRejoinForm();
    } catch {}
})

socket.on('receive_message', (data) => {
    receiveMessage(data)
});

socket.on('session_state', (data) => {
    if(data.isFinished){
        callErrorPopup("Conversation was finished by an agent!");
    }
    if(data.isBotChat == false && data.isAgentOn == false){
        waitingForAgent = true;
        requestBtn.classList.add("chat-displayNone");
        opAgentConnectingText(0);
    }else{
        requestBtn.classList.remove("chat-displayNone");
        waitingForAgent = false;
    }
});

socket.on('agent_connected', (data) => {
    waitingForAgent = false;
    document.querySelector('.optiflowz-chat-header img').src = data.PhotoURL || "DefaultIcon.png";
    currentAgentIcon = data.PhotoURL;
    document.querySelector('.optiflowz-chat-header h1').innerHTML = data.Name;
});

socket.on('agent_finished', (data) => {
    callErrorPopup("Agent je završio konverzaciju");
    localStorage.removeItem("sessionID");
});

socket.on('error', (data) => {
    if(data.content == "Can't load finished session"){
        closeOptiFlowzRejoinForm();
    }
    callErrorPopup(data.content);
});

function callErrorPopup(data){
    document.querySelector('.optiflowz-chat-error h2').innerHTML = data;
    document.querySelector('.optiflowz-chat-error').classList.add('open');
}

let lastStep = null;
socket.on('user_typing', (data) => {
    if(data.userID != "s"){
        let stepElement = document.createElement("div");
        stepElement.classList = "optiflowz-chat-message-agent optiflowz-typing-indicator";
        stepElement.innerHTML = `
        <img src="${currentAgentIcon}" alt="AI Agent Avatar">
        <div>
            <span></span>
            <span></span>
            <span></span>
        </div>`;
        chatMessages.appendChild(stepElement);
        lastStep = stepElement;
        scrollToBottom();
    }
});

socket.on('step', (data) => {
    if(data == "typing"){
        let stepElement = document.createElement("div");
        stepElement.classList = "optiflowz-chat-message-agent optiflowz-typing-indicator";
        stepElement.innerHTML = `
        <img src="${currentAgentIcon}" alt="AI Agent Avatar">
        <div>
            <span></span>
            <span></span>
            <span></span>
        </div>`;
        chatMessages.appendChild(stepElement);
        lastStep = stepElement;
        scrollToBottom();
    }
    else{
        if(lastStep){
            chatMessages.removeChild(lastStep);
            lastStep = null;
        }
        let stepElement = document.createElement("div");
        stepElement.classList = "optiflowz-chat-message-agent optiflowz-typing-indicator";
        stepElement.innerHTML = `
        <img src="${currentAgentIcon}" alt="AI Agent Avatar">
        <div>
            <span></span>
            <span></span>
            <span></span>
            <p>${data}</p>
        </div>`;
        chatMessages.appendChild(stepElement);
        lastStep = stepElement;
        scrollToBottom();
    }
});

socket.on('user_stop_typing', (data) => {
    if(data.userID == "a" && lastStep){
        chatMessages.removeChild(lastStep);
        lastStep = null;
    }
})

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

        if(lastStep){
            chatMessages.removeChild(lastStep);
            lastStep = null;
        }

        let mTime = data.timeStamp, image = "aiAgentImg.png";
        if(data.author == "agent"){
            mTime = new Date(Number(data.timeStamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
            image = data.image;
        }

        var userMsg=document.createElement("div");
        userMsg.classList.add("optiflowz-chat-message-agent");
        userMsg.innerHTML=`
        <img src="${image}" alt="Agent Avatar">
        <div>
            <p>${data.content}</p>
            <span>${mTime}</span>
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
    return new Promise(async (resolve, reject) => {
        let chatHistory = await load_convo(ssID);
        if(!chatHistory)
        {
            if(rejoin){
                document.querySelector('.optiflowz-chat-rejoin-code').classList.add("error");
            }
            return reject(false);
        }

        if(chatHistory?.error == "Can't load finished session" && !rejoin){
            newChatBtn.click();
            document.querySelector("#optiflowz-chat-more div").classList.remove("open");
            return reject(false);
        }

        if(chatHistory.convo){
            if (!chatHistory.convo[0].conversation[0].Content){
                if(rejoin){
                    document.querySelector('.optiflowz-chat-rejoin-code').classList.add("error");
                }
                return reject(false);
            }
        }else{ return reject(false); }

        chatMessages.innerHTML = ''; // Clear existing messages
        chatHistory.convo[0].conversation.forEach(message => {
            let messageElement = document.createElement("div");
            if (message.Sender === 's') {
                messageElement.classList.add("optiflowz-chat-message-user");
            } else if( message.Sender === 'a') {
                messageElement.classList.add("optiflowz-chat-message-agent");
                messageElement.innerHTML = `<img src="${chatHistory.convo[0].Agent.Image || `DefaultIcon.png`}" alt="Agent Avatar">`;
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

        if(chatHistory.convo[0].Agent) {
            currentAgentIcon = chatHistory.convo[0].Agent.Image || `DefaultIcon.png`;
            document.querySelector('.optiflowz-chat-header img').src = chatHistory.convo[0].Agent.Image || `DefaultIcon.png`;
            document.querySelector('.optiflowz-chat-header h1').innerHTML = chatHistory.convo[0].Agent.Name;
        }else{
            currentAgentIcon = "aiAgentImg.png";
            document.querySelector('.optiflowz-chat-header img').src = "aiAgentImg.png";
            document.querySelector('.optiflowz-chat-header h1').innerHTML = "AI AGENT";
        }

        scrollToBottom();
        return resolve(true);
    });
}

async function load_convo(ssID) {
    return new Promise((resolve, reject) => {
      socket.emit('load_convo',{ sessionID: ssID},(convo, err) => {
          if (err){
            localStorage.removeItem("sessionID");
            callErrorPopup(err.error);
            return reject(err.success);
          }
          resolve(convo);
        }
      );
    });
}

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

let didEmitTyping = false;
let isTypingTimeout = setTimeout(() => {
    socket.emit("typing", false);
    didEmitTyping = false;
}, 1500);
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
        if(!didEmitTyping){
            socket.emit("typing", true);
            didEmitTyping = true;
        }
        clearTimeout(isTypingTimeout);
        isTypingTimeout = setTimeout(() => {
            socket.emit("typing", false);
            didEmitTyping = false;
        }, 1500);
    }else{
        sendBtn.classList.remove("clickable");
        sendBtn.disabled = true;
    }
})
textarea.addEventListener("focusout", () => {
    clearTimeout(isTypingTimeout);
    socket.emit("typing", false);
    didEmitTyping = false;
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

window.closeOptiFlowzErrorPopup = function() {
    document.querySelector('.optiflowz-chat-error').classList.remove('open');
}

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
        callErrorPopup("Vaša ocena je poslata!");
    }
});