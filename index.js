import "https://cdn.socket.io/4.7.2/socket.io.min.js";

const socketString = 'https://c78e-2a06-63c0-a01-6800-c77-356d-6245-bdec.ngrok-free.app/';
var socket;
socket = io(socketString, {
    transports: ['websocket'],
});

var optiflowzChat = document.createElement("div");
optiflowzChat.id = "optiflowz-chat";
optiflowzChat.innerHTML = `
<button id="optiflowz-chat-open">
    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3c5.5 0 10 3.58 10 8s-4.5 8-10 8c-1.24 0-2.43-.18-3.53-.5C5.55 21 2 21 2 21c2.33-2.33 2.7-3.9 2.75-4.5C3.05 15.07 2 13.13 2 11c0-4.42 4.5-8 10-8"></path></svg>
    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"></path></svg>
</button>
<div class="optiflowz-chat-wrapper" style="display: none;">
    <section class="optiflowz-chat-header">
        <div>
            <img src="https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png" alt="Default Agent Avatar">
            <h1>AI AGENT</h1>
        </div>
        <div>
            <button id="optiflowz-chat-request-agent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.5051 19H20C21.1046 19 22.0669 18.076 21.716 17.0286C21.1812 15.4325 19.8656 14.4672 17.5527 14.1329M14.5001 10.8645C14.7911 10.9565 15.1244 11 15.5 11C17.1667 11 18 10.1429 18 8C18 5.85714 17.1667 5 15.5 5C15.1244 5 14.7911 5.04354 14.5001 5.13552M9.5 14C13.1135 14 15.0395 15.0095 15.716 17.0286C16.0669 18.076 15.1046 19 14 19H5C3.89543 19 2.93311 18.076 3.28401 17.0286C3.96047 15.0095 5.88655 14 9.5 14ZM9.5 11C11.1667 11 12 10.1429 12 8C12 5.85714 11.1667 5 9.5 5C7.83333 5 7 5.85714 7 8C7 10.1429 7.83333 11 9.5 11Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button id="optiflowz-chat-more">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 13C6.55 13 7 12.55 7 12C7 11.45 6.55 11 6 11C5.45 11 5 11.45 5 12C5 12.55 5.45 13 6 13Z" stroke="black" stroke-width="2"/>
                    <path d="M12 13C12.55 13 13 12.55 13 12C13 11.45 12.55 11 12 11C11.45 11 11 11.45 11 12C11 12.55 11.45 13 12 13Z" stroke="black" stroke-width="2"/>
                    <path d="M18 13C18.55 13 19 12.55 19 12C19 11.45 18.55 11 18 11C17.45 11 17 11.45 17 12C17 12.55 17.45 13 18 13Z" stroke="black" stroke-width="2"/>
                </svg>
                <div>
                    <p id="optiflowz-chat-new-chat">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4V20M20 12H4" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Nova konverzacija
                    </p>
                    <p id="optiflowz-chat-rejoin">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 13C19 16.866 15.866 20 12 20C8.13401 20 5 16.866 5 13C5 9.13401 8.13401 6 12 6H17M17 6L14 3M17 6L14 9" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Ponovo se pridruži
                    </p>
                    <p id="optiflowz-chat-rating">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.0767 4.21969C11.4183 3.39839 12.5817 3.39839 12.9233 4.21968L14.7811 8.68645L19.6034 9.07305C20.49 9.14413 20.8496 10.2506 20.174 10.8293L16.5 13.9765L17.6225 18.6822C17.8288 19.5474 16.8876 20.2313 16.1285 19.7676L12 17.246L7.87146 19.7676C7.11236 20.2313 6.17111 19.5474 6.3775 18.6822L7.49998 13.9765L3.82593 10.8293C3.1504 10.2506 3.50992 9.14413 4.39658 9.07305L9.21882 8.68645L11.0767 4.21969Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Oceni konverzaciju
                    </p>
                </div>
            </button>
        </div>
    </section>
    <section class="optiflowz-chat-body">
        <div class="optiflowz-chat-messages"></div>
    </section>
    <section class="optiflowz-chat-input">
        <div>
            <textarea name="chat-input" id="optiflowz-chat-textarea" placeholder="Unesite poruku..."></textarea>
            <button id="optiflowz-chat-send">
                <svg data-v-2a7fb1c3="" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="m2 21l21-9L2 3v7l15 2l-15 2z"></path></svg>
            </button>
        </div>
    </section>
    <div class="optiflowz-rating-wrapper">
        <div class="closeRatingWrapper" onclick="closeOptiFlowzRatingScreen()"></div>
        <div class="optiflowz-rating-content">
            <h2>Kako ste zadovoljni ovom konverzacijom?</h2>
            <div class="optiflowz-rating-buttons">
                <button data-rating="1" onclick="setSelected(this, this.parentElement)">1</button>
                <button data-rating="2" onclick="setSelected(this, this.parentElement)">2</button>
                <button data-rating="3" onclick="setSelected(this, this.parentElement)">3</button>
                <button data-rating="4" onclick="setSelected(this, this.parentElement)">4</button>
                <button data-rating="5" class="selected" onclick="setSelected(this, this.parentElement)">5</button>
            </div>
            <div class="optiflowz-rating-actions">
                <button onclick="closeOptiFlowzRatingScreen()">Otkaži</button>
                <button id="optiflowz-chat-rate-button">Potrvdi</button>
            </div>
        </div>
    </div>
    <div class="optiflowz-chat-form">
        <div class="closeRatingWrapper" onclick="closeOptiFlowzAgentForm()"></div>
        <div class="optiflowz-rating-content">
            <div>
                <p>Ispunite formular kako bismo vas povezali sa našim agentom</p>
                <input type="text" placeholder="Ime i prezime" class="optiflowz-chat-form-name" required>
                <input type="email" placeholder="Email adresa" class="optiflowz-chat-form-email" required>
                <section>
                    <button onclick="closeOptiFlowzAgentForm()">Otkaži</button>
                    <button id="optiflowz-chat-request-agent-button">Potrvdi</button>
                </section>
            </div>
        </div>
    </div>
    <div class="optiflowz-chat-form-rejoin">
        <div class="closeRatingWrapper" onclick="closeOptiFlowzRejoinForm()"></div>
        <div class="optiflowz-rating-content">
            <div>
                <p>Unesite kod kako biste se vratili na staru konverzaciju</p>
                <input type="text" placeholder="Kod" class="optiflowz-chat-rejoin-code" required>
                <section>
                    <button onclick="closeOptiFlowzRejoinForm()">Otkaži</button>
                    <button id="optiflowz-chat-rejoin-button">Potrvdi</button>
                </section>
            </div>
        </div>
    </div>
    <div class="optiflowz-chat-error">
        <div class="closeRatingWrapper" onclick="closeOptiFlowzErrorPopup()"></div>
        <div class="optiflowz-rating-content">
            <div>
                <h2>Desila se greska!</h2>
                <section>
                    <button onclick="closeOptiFlowzErrorPopup()">Zatvori</button>
                </section>
            </div>
        </div>
    </div>
    <div class="optiflowz-chat-loader">
        <svg viewBox="0 0 16 16" height="48" width="48" class="loading-spinner">
            <circle r="7px" cy="8px" cx="8px"></circle>
        </svg>
    </div>
</div>
`;
document.body.appendChild(optiflowzChat);
document.body.innerHTML += `<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat@0.0.8/style.css">`;

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
            <img src="https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png" alt="Agent Avatar">
            <div>
                    <p>Zdravo! Kako mogu da Vam pomognem danas?</p>
                    <span>${time}</span>
            </div>
        </div>`;
        addQuestionsToChat();
        removeChatLoader();
    }
    else{
        socket.emit('join_room', {
            sessionID: localStorage.sessionID
        })
        var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        chatMessages.innerHTML = `
        <div class="optiflowz-chat-message-agent">
            <img src="https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png" alt="Agent Avatar">
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

            removeChatLoader();

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

            socket.emit('sync_botStep', { sessionID: localStorage.sessionID}, (data, err) => {
                setTimeout(() => {
                    if(data.botStep != undefined && data.botStep != null){
                        let stepElement = document.createElement("div");
                        stepElement.classList = "optiflowz-chat-message-agent optiflowz-typing-indicator";
                        stepElement.innerHTML = `
                        <img src="${currentAgentIcon}" alt="AI Agent Avatar">
                        <div>
                            <span></span>
                            <span></span>
                            <span></span>
                            <p>${data.botStep}</p>
                        </div>`;
                        chatMessages.appendChild(stepElement);
                        lastStep = stepElement;
                        scrollToBottom();
                    }
                }, 50);
            });
        } catch { removeChatLoader(); }
    }
});

var sendBtn = document.getElementById('optiflowz-chat-send');
var textarea = document.getElementById('optiflowz-chat-textarea');
var chatMessages = document.querySelector('.optiflowz-chat-messages');
var newChatBtn = document.getElementById('optiflowz-chat-new-chat');
var rejoinBtn = document.getElementById('optiflowz-chat-rejoin-button');
var requestBtn = document.getElementById("optiflowz-chat-request-agent");
var currentAgentIcon = "https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png";

sendBtn.addEventListener("click",()=>{
    sendMessage();
});

let isWaitingForBot = false, isBotChat = true;
function sendMessage(){
    console.log(isBotChat);
    if(isWaitingForBot){
        return;
    }

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

        if(!isBotChat){
            isWaitingForBot = false;
        }else{
            isWaitingForBot = true;
        }
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
            <img src="https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png" alt="Agent Avatar">
            <div>
                    <p>Zdravo! Kako mogu da Vam pomognem danas?</p>
                    <span>${time}</span>
            </div>
        </div>`;
        addQuestionsToChat();
    });

    waitingForAgent = false;
    isBotChat = true;
    requestBtn.classList.remove("chat-displayNone");

    document.querySelector('.optiflowz-chat-header img').src = "https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png";
    currentAgentIcon = "https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png";
    document.querySelector('.optiflowz-chat-header h1').innerHTML = "AI AGENT";

    socket.on('receive_message', (data) => {
        receiveMessage(data)
    });

    socket.on('session_state', (data) => {
        if(!data.isBotChat){
            isBotChat = false;
        }
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
        isWaitingForBot = false;
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
    if(!data.isBotChat){
        isBotChat = false;
    }
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
    isWaitingForBot = false;
    document.querySelector('.optiflowz-chat-header img').src = data.PhotoURL || "https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/DefaultIcon.png";
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

        isWaitingForBot = false;
        if(textarea.value.trim() != ""){
            sendBtn.classList.add("clickable");
            sendBtn.disabled = false;
        }

        if(lastStep){
            chatMessages.removeChild(lastStep);
            lastStep = null;
        }

        let mTime = data.timeStamp, image = "https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png";
        if(data.author == "agent"){
            isWaitingForBot = false;
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
                messageElement.innerHTML = `<img src="${chatHistory.convo[0].Agent.Image || `https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/DefaultIcon.png`}" alt="Agent Avatar">`;
            }
            else {
                messageElement.classList.add("optiflowz-chat-message-agent");
                messageElement.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png" alt="Agent Avatar">`;
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
            currentAgentIcon = chatHistory.convo[0].Agent.Image || `https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/DefaultIcon.png`;
            document.querySelector('.optiflowz-chat-header img').src = chatHistory.convo[0].Agent.Image || `https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/DefaultIcon.png`;
            document.querySelector('.optiflowz-chat-header h1').innerHTML = chatHistory.convo[0].Agent.Name;
        }else{
            currentAgentIcon = "https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png";
            document.querySelector('.optiflowz-chat-header img').src = "https://cdn.jsdelivr.net/gh/OptiFlowz/Laptop-Centar-Chat/aiAgentImg.png";
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

    if(textToSend != "" && !isWaitingForBot){
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

function removeChatLoader(){
    document.querySelector(".optiflowz-chat-loader").classList.add("off");
}

function addChatLoader(){
    document.querySelector(".optiflowz-chat-loader").classList.remove("off");
}