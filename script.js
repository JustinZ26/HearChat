let db = { user: {}, contacts: [], messages: {} };
let currentContact = null;

async function init() {
    const res = await fetch('/api/get-all-data');
    db = await res.json();
    renderUserProfile(db.user);
    renderContacts(db.contacts);
    setupContactClicks();
    if (db.contacts.length) selectContact(db.contacts[0].name);
    
    // waitForVoices().then(() => {
    //     announceUnreadMessages(db.contacts);
    // }); 
}
document.addEventListener('DOMContentLoaded', init);

function renderUserProfile(user) {
    document.querySelector('.user-info h3').textContent = user.name;
    document.querySelector('.user-profile .avatar img').src = user.avatar;
    document.querySelector('.user-profile .status').className = 'status ' + user.status;
}

function renderContacts(contacts) {
    const list = document.querySelector('.contact-list');
    list.innerHTML = '';
    contacts.forEach(c => {
        const li = document.createElement('li');
        li.className = 'contact';
        if (c.unread) li.classList.add('has-unread');
        li.dataset.name = c.name;
        li.innerHTML = `
        <div class="contact-avatar">
            <img src="${c.avatar}" alt="${c.name}">
            <span class="status ${c.status}"></span>
        </div>
        <div class="contact-info">
            <h4>${c.name}</h4>
            <p>${c.lastMessage}</p>
        </div>
        <div class="contact-time">
            <span>${c.time}</span>
            ${c.unread ? `<span class="unread">${c.unread}</span>` : ''}
        </div>
        `;
        list.appendChild(li);
    });
}

function setupContactClicks() {
    document.querySelector('.contact-list').addEventListener('click', e => {
        const li = e.target.closest('.contact');
        if (!li) return;
        // clear unread badge
        const idx = db.contacts.findIndex(c => c.name === li.dataset.name);
        if (db.contacts[idx].unread) {
            db.contacts[idx].unread = 0;
            const badge = li.querySelector('.unread');
            if (badge) badge.remove();
        }
        document.querySelectorAll('.contact').forEach(c=>c.classList.remove('active'));
        li.classList.add('active');
        selectContact(li.dataset.name);
    });
}

async function selectContact(name) {
    currentContact = name;
    document.querySelector('.chat-header .contact-info h4').textContent = name;
    const c = db.contacts.find(c => c.name === name);
    const statusEl = document.querySelector('.chat-header .contact-info p');
    statusEl.textContent = c.status === 'online' ? 'Online • Typing...' : c.status;
    await loadMessages(name);
}

async function loadMessages(contactName) {
    const res = await fetch(`/api/get-messages?name=${encodeURIComponent(contactName)}`);
    const messages = await res.json();

    const messagesContainer = document.querySelector('.chat-messages');
    messagesContainer.innerHTML = '';

    messages.forEach(m => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + (m.from === 'me' ? 'sent' : 'received');
        messageDiv.innerHTML = `
            ${m.from === 'them' ? `<div class="message-avatar"><img src="${getAvatar(contactName)}"></div>` : ''}
            <div class="message-content">
                <p>${m.text}</p>
                <span class="message-time">${m.time}</span>
            </div>
        `;
        messageDiv.addEventListener('click', () => { 
            speakText(m.text); 
        });
        messagesContainer.appendChild(messageDiv);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function waitForVoices() {
    return new Promise(resolve => {
        let voices = speechSynthesis.getVoices();
        if (voices.length) {
            resolve();
        } else {
            speechSynthesis.onvoiceschanged = () => { 
                resolve(); 
            };
        }
    });
}

// function renderMessages(name) {
//     const msgs = db.messages[name] || [];
//     const cont = document.querySelector('.chat-messages');
//     cont.innerHTML = '';
//     msgs.forEach(m => {
//         const div = document.createElement('div');
//         div.className = 'message ' + (m.from === 'me' ? 'sent' : 'received');
//         div.innerHTML = `
//         ${m.from==='them'? `<div class="message-avatar"><img src="${getAvatar(name)}"></div>`: ''}
//         <div class="message-content">
//             <p>${m.text}</p>
//             <span class="message-time">${m.time}</span>
//         </div>
//         `;
//         div.addEventListener('click', () => { 
//             speakText(m.text); });
//         cont.appendChild(div);
//     });
//     cont.scrollTop = cont.scrollHeight;
// }

function getAvatar(name) {
    return db.contacts.find(c=>c.name===name).avatar;
}

function announceUnreadMessages(contacts) {
    let speechText = "";
    contacts.forEach(contact => {
        if (contact.unread != 0) {
            speechText += `You have ${contact.unread} unread message${contact.unread > 1 ? 's' : ''} from ${contact.name}. `;
        }
    });
    if (speechText) {
        speakText(speechText);
    } else {
        speakText("No unread messages, You're all caught up");
    }
}


function speakText(text, onComplete) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    utterance.onend = () => {
        if (typeof onComplete === 'function') {
            onComplete();
        }
    };

    function setVoiceAndSpeak() {
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice =>
            voice.name.includes("Female") || voice.name.includes("Google UK English Female") || voice.name.includes("Jenny") || voice.name.includes("Microsoft Zira") 
        );
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        speechSynthesis.speak(utterance);
    }

    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => {
            setVoiceAndSpeak();
        };
    } else {
        setVoiceAndSpeak();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Add toggle functionality for mobile menu
    const handleMobileMenu = function() {
        const sidebar = document.querySelector('.sidebar');
        const logo = document.querySelector('.logo');
        
        if (window.innerWidth <= 768 && logo) {
            logo.addEventListener('click', function() {
                sidebar.classList.toggle('show-contacts');
            });
            
            // Close sidebar when clicking on a contact on mobile
            const contacts = document.querySelectorAll('.contact');
            contacts.forEach(contact => {
                contact.addEventListener('click', function() {
                    sidebar.classList.remove('show-contacts');
                });
            });
        }
    };
 
    handleMobileMenu();
    window.addEventListener('resize', handleMobileMenu);
    
    // Contact list click handling
    const contacts = document.querySelectorAll('.contact');
    contacts.forEach(contact => {
        contact.addEventListener('click', function() {
            // Remove active class from all contacts
            contacts.forEach(c => c.classList.remove('active'));
            // Add active class to clicked contact
            this.classList.add('active');
            
            // Update chat header with contact info
            const contactName = this.querySelector('.contact-info h4').textContent;
            const contactStatus = this.querySelector('.status').classList.contains('online') ? 'Online' : 
                                 this.querySelector('.status').classList.contains('away') ? 'Away' : 'Offline';
            
            document.querySelector('.chat-header .contact-info h4').textContent = contactName;
            document.querySelector('.chat-header .contact-info p').textContent = contactStatus === 'Online' ? 'Online • Typing...' : contactStatus;
            
            // Store current contact
            sessionStorage.setItem('currentContact', contactName);
            
            // Clear unread count if any
            const unreadBadge = this.querySelector('.unread');
            if (unreadBadge) {
                unreadBadge.remove();
            }
        });
    });

    let pressTimer;
    let startX, startY;
    const movementThreshold = 10; // pixels – adjust as needed

    // Mouse (desktop)
    document.body.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        startY = e.clientY;
        pressTimer = setTimeout(() => {
            console.log("Long press detected. Starting voice command...");
            startListening();
        }, 1000);
    });

    document.body.addEventListener('mousemove', (e) => {
        if (Math.abs(e.clientX - startX) > movementThreshold || 
            Math.abs(e.clientY - startY) > movementThreshold) {
            clearTimeout(pressTimer); // Cancel if moved too much
        }
    });

    document.body.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
    });
    document.body.addEventListener('mouseleave', () => {
        clearTimeout(pressTimer);
    });

    // Touch (mobile)
    document.body.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;

        pressTimer = setTimeout(() => {
            console.log("Long press detected. Starting voice command...");
            startListening();
        }, 100);
    });

    document.body.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        if (Math.abs(touch.clientX - startX) > movementThreshold || 
            Math.abs(touch.clientY - startY) > movementThreshold) {
            clearTimeout(pressTimer); // Cancel if moved too much
        }
    });

    document.body.addEventListener('touchend', () => {
        clearTimeout(pressTimer);
    });




    let recognition;

    function startListening() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Speech Recognition not supported.");

        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            console.log('Command:', command);
            handleVoiceCommand(command);
        };

        recognition.onerror = (e) => {
            console.error("Error:", e.error);
        };

        recognition.start();
    }

    function handleVoiceCommand(command) {
        if (command.includes("test")) {
            const funnyResponses = [
                "Testing testing... one two three...",
                "Mic check complete!",
                "System online. All modules functional.",
                "Beep boop beep...",
                "System test passed!",
                "Boat goes binted",
                "Wooden shovel"
            ];

            const randomResponse = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
            speakText(randomResponse);
        }

        else if (command.includes("reply")) {
            speakText("Recording your reply...", () => {
                startReplyMode();
            });
        }

        else if (command.includes("unread")) {
            announceUnreadMessages(db.contacts);
        }

        else if (command.includes("who")) {
            speakText("You are currently chatting with " + currentContact);
        }

        else if (command.includes("navigate")) {
            speakText(`Who do you want to chat with?`, () => {
                navigate();
            });
        }

        else if (command.includes("message")) {
            speakText(`How many last message you want to read`, () => {
                readMessage();
            });
        }



    }

    function startReplyMode() {
        recognition && recognition.abort(); // Cancel previous recognition

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser doesn't support speech recognition.");
            return;
        }

        const replyRecognition = new SpeechRecognition();
        replyRecognition.lang = 'en-US';
        replyRecognition.interimResults = false;
        replyRecognition.maxAlternatives = 1;

        console.log("Listening for your reply...");
        replyRecognition.start();

        replyRecognition.onresult = (event) => {
            const replyText = event.results[0][0].transcript;
            console.log("Reply captured:", replyText);

            speakText(`Do you want to reply with "${replyText}"? Say yes or no.`, () => {
                waitForYesNo(replyText);
            });
        };

        replyRecognition.onerror = (e) => {
            console.error("Reply error:", e.error);
            speakText("I couldn't hear your reply, Try again?");
        };

        replyRecognition.onend = () => {
            console.log("Reply recognition ended.");
        };
    }

    function waitForYesNo(replyText) {
        const confirmRecog = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        confirmRecog.lang = 'en-US';
        confirmRecog.interimResults = false;
        confirmRecog.continuous = false;

        confirmRecog.onresult = (event) => {
            const answer = event.results[0][0].transcript.toLowerCase();
            console.log("Confirmation answer:", answer);

            if (answer.includes("yes")) {
                speakText("Sending reply now");

                // Insert the replyText into the message input
                const messageInput = document.querySelector('.message-input input');
                messageInput.value = replyText;

                // Call the sendMessage function
                sendMessage();
            } else {
                speakText("Okay, reply cancelled.");
            }
        };

        confirmRecog.onerror = (e) => {
            console.error("Confirmation error:", e.error);
        };

        // Delay recognizer slightly to make sure TTS is done and mic is ready
        setTimeout(() => {
            console.log("Now listening for yes/no...");
            confirmRecog.start();
        }, 300);
    }
    
    function navigate() {
        const contactRecog = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        contactRecog.lang = 'en-US';
        contactRecog.interimResults = false;
        contactRecog.continuous = false;

        contactRecog.onresult = (event) => {
            const answer = event.results[0][0].transcript.toLowerCase();
            console.log("contact:", answer);

            let found = false;

            for (const contact of db.contacts) {
                if (answer.includes(contact.name.toLowerCase())) {
                    console.log("Matched contact:", contact.name);
                    selectContact(contact.name);
                    found = true;
                    speakText("Successfully entered chat with " + contact.name);
                    break;
                }
            }

            if (!found) {
                console.log("No matching contact found");
                speakText("Contact not found! Let's use manual selection.");

                // Start manual mode
                manualContactSelection();
            }
        };

        contactRecog.onerror = (e) => {
            console.error("Confirmation error:", e.error);
        };

        setTimeout(() => {
            console.log("Now listening for contact...");
            contactRecog.start();
        }, 300);
    }

    function manualContactSelection() {
        // Read out list
        let listText = "Please choose a contact by number. ";
        db.contacts.forEach((contact, index) => {
            listText += (index + 1) + " for " + contact.name + ". ";
        });

        speakText(listText, () => {
            // After TTS is done, start listening for number
            listenForNumber();
        });
    }

    function listenForNumber() {
        const numberRecog = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        numberRecog.lang = 'en-US';
        numberRecog.interimResults = false;
        numberRecog.continuous = false;

        numberRecog.onresult = (event) => {
            const numAnswer = event.results[0][0].transcript.toLowerCase();
            console.log("number selection:", numAnswer);

            // Extract number (handle words like "one", "two", "three")
            const spokenNumber = convertSpokenNumber(numAnswer);

            if (spokenNumber >= 1 && spokenNumber <= db.contacts.length) {
                const selectedContact = db.contacts[spokenNumber - 1];
                selectContact(selectedContact.name);
                speakText("Successfully entered chat with " + selectedContact.name);
            } else {
                speakText("Invalid number selection.");
            }
        };

        numberRecog.onerror = (e) => {
            console.error("Number recognition error:", e.error);
        };

        numberRecog.start();
    }

    // Helper to convert spoken words to numbers
    function convertSpokenNumber(text) {
        const map = {
            "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
            "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10
        };

        text = text.toLowerCase().trim();

        // Try to find numeric digits first
        const digitMatch = text.match(/\d+/);
        if (digitMatch) {
            return parseInt(digitMatch[0]);
        }

        // Try to match word-based numbers
        for (const word in map) {
            if (text.includes(word)) {
                return map[word];
            }
        }

        return -1; // invalid
    }


    function readMessage() {
        const numberRecog = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        numberRecog.lang = 'en-US';
        numberRecog.interimResults = false;
        numberRecog.continuous = false;

        numberRecog.onresult = async (event) => {
            const numAnswer = event.results[0][0].transcript.toLowerCase();
            console.log("Read message count selection:", numAnswer);

            const spokenNumber = convertSpokenNumber(numAnswer);

            if (spokenNumber >= 1 && spokenNumber <= 10) {
                speakText(`Reading last ${spokenNumber} messages with ${currentContact}`);
                await readLastMessages(spokenNumber);
            } else {
                speakText("Invalid number. Please say a number between 1 and 10.");
            }
        };

        numberRecog.onerror = (e) => {
            console.error("Number recognition error:", e.error);
        };

        numberRecog.start();
    }

    async function readLastMessages(count) {
        try {
            const res = await fetch(`/api/get-messages?name=${encodeURIComponent(currentContact)}`);
            const messages = await res.json();

            const lastMessages = messages.slice(-count);

            for (const message of lastMessages) {
                let who = (message.from === 'me') ? "you said" : currentContact+'said';
                const timeText = message.time;

                speakText(`At ${timeText}, ${who}: ${message.text}`);
                await sleep(1500);
            }
        } catch (err) {
            console.error(err);
            speakText("Failed to load messages.");
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }





    
    // Send button functionality
    const sendBtn = document.querySelector('.send-btn');
    const messageInput = document.querySelector('.message-input input');
    
    async function sendMessage() {
        const messageText = messageInput.value.trim();
        console.log('sending message ' + messageText)
        if (messageText) {
            // Create new message element
            const messagesContainer = document.querySelector('.chat-messages');
            const newMessage = document.createElement('div');
            newMessage.className = 'message sent';
            
            // Get current time
            const now = new Date();
            const hours = now.getHours() % 12 || 12;
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            const timeString = `${hours}:${minutes} ${ampm}`;
            
            // Set message content
            newMessage.innerHTML = `
                <div class="message-content">
                    <p>${messageText}</p>
                    <span class="message-time">${timeString}</span>
                </div>
            `;
            
            // Add message to chat
            messagesContainer.appendChild(newMessage);
            
            // Clear input field
            messageInput.value = '';
            
            // Scroll to bottom of chat
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Send message to backend API
            await fetch('/api/save-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: currentContact, // change this based on active chat
                    from: 'me',
                    text: messageText,
                    time: timeString
                })
            });
            console.log('successfully sent to database')

            // Re-fetch updated data & re-render messages
            await loadMessages(currentContact);
            messageInput.value = '';
            // renderMessages(currentContact);

            console.log('successfully refetch the chatroom')
            // Simulate reply after 1-2 seconds
            setTimeout(simulateReply, Math.random() * 1000 + 2000);
            console.log('called simulateReply')
        }
    }
    
    // Send message when send button is clicked
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    // Send message when Enter key is pressed
    if (messageInput) {
        messageInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Simulate reply from the active contact
    async function simulateReply() {
        console.log("Simulating reply...");
        const replies = [
            "That sounds great!",
            "I'll check and get back to you.",
            "Thanks for letting me know!",
            "Can we discuss this later?",
            "Perfect! Looking forward to it.",
            "I'm not sure about that...",
            "Let me think about it.",
            "Yes, that works for me!",
            "Could you send me more details?",
            "I'll be there in 10 minutes."
        ];
        
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const messagesContainer = document.querySelector('.chat-messages');
        const activeContact = document.querySelector('.contact.active');
        
        if (messagesContainer && activeContact) {
            const contactAvatar = activeContact.querySelector('img').src;

            const now = new Date();
            const hours = now.getHours() % 12 || 12;
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            const timeString = `${hours}:${minutes} ${ampm}`;
            
            const newMessage = document.createElement('div');
            newMessage.className = 'message received';
            newMessage.innerHTML = `
                <div class="message-avatar">
                    <img src="${contactAvatar}" alt="Contact Avatar">
                </div>
                <div class="message-content">
                    <p>${randomReply}</p>
                    <span class="message-time">${timeString}</span>
                </div>
            `;
            
            messagesContainer.appendChild(newMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            await fetch('/api/save-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: currentContact,
                    from: 'them', 
                    text: randomReply,
                    time: timeString
                })
            });
            console.log('successfully saved ' + randomReply)

            await loadMessages(currentContact);
            speakText(currentContact + "responded") // instant TTS
            sleep(250)
            speakText(randomReply)
            // renderMessages(currentContact);
        }
    }

    
    // Attachment button functionality
    const attachmentBtn = document.querySelector('.input-actions .action-btn:first-child');
    if (attachmentBtn) {
        attachmentBtn.addEventListener('click', function() {
            alert('Attachment feature clicked');
        });
    }
    
    // Image button functionality
    const imageBtn = document.querySelector('.input-actions .action-btn:last-child');
    if (imageBtn) {
        imageBtn.addEventListener('click', function() {
            alert('Image upload feature clicked');
        });
    }
    
    // Microphone button functionality
    const microphoneBtn = document.querySelector('.send-actions .action-btn');

    if (microphoneBtn) {
        microphoneBtn.addEventListener('click', function () {
            // Check for browser compatibility
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert("Your browser doesn't support speech recognition.");
                return;
            }

            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.start();
            microphoneBtn.classList.add('recording'); // add class for visual feedback
            console.log('Listening...');

            recognition.onresult = function (event) {
                const transcript = event.results[0][0].transcript;
                console.log('Transcribed:', transcript);
                messageInput.value = transcript; // Puts it into the message box
            };

            recognition.onerror = function (event) {
                console.error('Speech recognition error:', event.error);
                alert('Failed to record voice: ' + event.error);
                microphoneBtn.classList.remove('recording'); // When stopping
            };

            recognition.onend = function () {
                console.log('Recording ended');
                microphoneBtn.classList.remove('recording'); // When stopping
            };
        });
    }
    
    // Call button functionality - Updated to navigate to call page
    const callBtn = document.querySelector('.chat-actions .action-btn:first-child');
    if (callBtn) {
        callBtn.addEventListener('click', function() {
            const contactName = document.querySelector('.chat-header .contact-info h4').textContent;
            // Store contact name in sessionStorage before navigating
            sessionStorage.setItem('currentContact', contactName);
            // Navigate to call page
            window.location.href = 'call.html';
        });
    }
    
    // Video call button functionality - Updated to navigate to video call page
    const videoCallBtn = document.querySelector('.chat-actions .action-btn:nth-child(2)');
    if (videoCallBtn) {
        videoCallBtn.addEventListener('click', function() {
            const contactName = document.querySelector('.chat-header .contact-info h4').textContent;
            // Store contact name in sessionStorage before navigating
            sessionStorage.setItem('currentContact', contactName);
            // Navigate to video call page
            window.location.href = 'video-call.html';
        });
    }
    
    // Info button functionality - Updated to navigate to contact info page
    const infoBtn = document.querySelector('.chat-actions .action-btn:last-child');
    if (infoBtn) {
        infoBtn.addEventListener('click', function() {
            const contactName = document.querySelector('.chat-header .contact-info h4').textContent;
            // Navigate to contact info page
            window.location.href = 'contact-info.html';
        });
    }
    
    // Settings page functionality
    if (window.location.pathname.includes('settings.html')) {
        const settingItems = document.querySelectorAll('.setting-item');
        settingItems.forEach(item => {
            item.addEventListener('click', function() {
                const settingName = this.querySelector('.setting-info h4').textContent;
                alert(`Navigating to ${settingName} settings...`);
            });
        });
        
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to log out?')) {
                    alert('Logging out...');
                    // Redirect to login page or index
                    window.location.href = 'index.html';
                }
            });
        }
        
        const editProfileBtn = document.querySelector('.edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                alert('Edit profile clicked');
            });
        }
    }
    
    // Call page functionality
    if (window.location.pathname.includes('call.html')) {
        // Set caller name from sessionStorage
        const currentContact = sessionStorage.getItem('currentContact');
        if (currentContact) {
            document.querySelector('.caller-name').textContent = currentContact;
        }
        
        // End call button
        const endCallBtn = document.querySelector('.end-call');
        if (endCallBtn) {
            // Add click event to force redirect to index.html
            endCallBtn.addEventListener('click', function(e) {
                // If it's an <a> element, let the default action work
                if (this.tagName.toLowerCase() !== 'a') {
                    e.preventDefault();
                    window.location.href = 'index.html';
                }
            });
            
            // Also handle it when it's a link with href
            if (endCallBtn.getAttribute('href') !== 'index.html') {
                endCallBtn.setAttribute('href', 'index.html');
            }
        }
        
        // Other call buttons
        const speakerBtn = document.querySelector('.call-btn.speaker');
        if (speakerBtn) {
            speakerBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                alert('Speaker ' + (this.classList.contains('active') ? 'on' : 'off'));
            });
        }
        
        const muteCallBtn = document.querySelector('.call-btn.mute');
        if (muteCallBtn) {
            muteCallBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                alert('Microphone ' + (this.classList.contains('active') ? 'muted' : 'unmuted'));
            });
        }
        
        const addCallBtn = document.querySelector('.call-btn.add-call');
        if (addCallBtn) {
            addCallBtn.addEventListener('click', function() {
                alert('Add participant to call');
            });
        }
        
        // New call button
        const newCallBtn = document.querySelector('.new-call-btn');
        if (newCallBtn) {
            newCallBtn.addEventListener('click', function() {
                alert('Selecting new contact to call...');
                // In a real app, this would open a contact picker dialog
                
                // For demo, we'll just simulate a call to another contact
                const contacts = ['Erlangga', 'JingkoisReal', 'Kelra', 'JingkoGod'];
                const randomContact = contacts[Math.floor(Math.random() * contacts.length)];
                
                // Store for returning to chat later
                sessionStorage.setItem('currentContact', randomContact);
                
                // Update call UI
                document.querySelector('.caller-name').textContent = randomContact;
                document.querySelector('.call-status').textContent = 'Calling...';
                document.querySelector('.call-duration').textContent = '00:00';
                
                // Reset any active call controls
                document.querySelectorAll('.call-btn').forEach(btn => {
                    if (!btn.classList.contains('end-call')) {
                        btn.classList.remove('active');
                    }
                });
                
                // Simulate connection
                setTimeout(function() {
                    document.querySelector('.call-status').textContent = 'Connected';
                    
                    // Reset and restart timer
                    clearInterval(callTimer);
                    callSeconds = 0;
                    startCallTimer();
                }, 2000);
            });
        }
        
        // Call back buttons
        const callBackBtns = document.querySelectorAll('.call-back-btn');
        callBackBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const contactName = this.closest('.call-item').querySelector('h4').textContent;
                
                // Store contact name for returning to chat later
                sessionStorage.setItem('currentContact', contactName);
                
                alert(`Calling ${contactName}...`);
                
                // Simulate active call
                document.querySelector('.caller-name').textContent = contactName;
                document.querySelector('.call-status').textContent = 'Calling...';
                document.querySelector('.call-duration').textContent = '00:00';
                
                // Reset any active call controls
                document.querySelectorAll('.call-btn').forEach(btn => {
                    if (!btn.classList.contains('end-call')) {
                        btn.classList.remove('active');
                    }
                });
                
                setTimeout(function() {
                    document.querySelector('.call-status').textContent = 'Connected';
                    
                    // Reset and restart timer
                    clearInterval(callTimer);
                    callSeconds = 0;
                    startCallTimer();
                }, 2000);
            });
        });
        
        // Call timer
        let callSeconds = 0;
        let callTimer;
        
        function startCallTimer() {
            callTimer = setInterval(function() {
                callSeconds++;
                const minutes = Math.floor(callSeconds / 60);
                const seconds = callSeconds % 60;
                
                document.querySelector('.call-duration').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        }
    }
    
    // Video call page functionality
    if (window.location.pathname.includes('video-call.html')) {
        // Set caller name from sessionStorage
        const currentContact = sessionStorage.getItem('currentContact');
        if (currentContact) {
            document.querySelector('.caller-info h3').textContent = currentContact;
        }
        
        // End call button
        const endCallBtn = document.querySelector('.end-call');
        if (endCallBtn) {
            // Add click event to force redirect to index.html
            endCallBtn.addEventListener('click', function(e) {
                // If it's an <a> element, let the default action work
                if (this.tagName.toLowerCase() !== 'a') {
                    e.preventDefault();
                    window.location.href = 'index.html';
                }
            });
            
            // Also handle it when it's a link with href
            if (endCallBtn.getAttribute('href') !== 'index.html') {
                endCallBtn.setAttribute('href', 'index.html');
            }
        }
        
        // Switch camera button
        const switchCameraBtn = document.querySelector('.video-call-btn.switch-camera');
        if (switchCameraBtn) {
            switchCameraBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                alert('Camera switched');
            });
        }
        
        // Toggle video
        const videoBtn = document.querySelector('.video-call-btn.video-off');
        if (videoBtn) {
            videoBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                alert('Video has been ' + (this.classList.contains('active') ? 'turned off' : 'turned on'));
            });
        }
        
        // Toggle mute
        const muteBtn = document.querySelector('.video-call-btn.mute');
        if (muteBtn) {
            muteBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                alert('Microphone has been ' + (this.classList.contains('active') ? 'muted' : 'unmuted'));
            });
        }
        
        // Toggle history panel
        const showHistoryBtn = document.querySelector('.show-history-btn');
        const closeHistoryBtn = document.querySelector('.close-history-btn');
        const historyPanel = document.querySelector('.video-call-history');
        
        if (showHistoryBtn && historyPanel) {
            showHistoryBtn.addEventListener('click', function() {
                historyPanel.classList.remove('hidden');
            });
        }
        
        if (closeHistoryBtn && historyPanel) {
            closeHistoryBtn.addEventListener('click', function() {
                historyPanel.classList.add('hidden');
            });
        }
        
        // Handle video call history buttons
        const videoBackBtns = document.querySelectorAll('.video-back-btn');
        videoBackBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const contactName = this.closest('.video-call-item').querySelector('h4').textContent;
                
                // Store contact name for returning to chat later
                sessionStorage.setItem('currentContact', contactName);
                
                // Update caller info
                document.querySelector('.caller-info h3').textContent = contactName;
                document.querySelector('.call-status').textContent = 'Calling...';
                
                // Hide the history panel
                document.querySelector('.video-call-history').classList.add('hidden');
                
                // Simulate connection
                setTimeout(function() {
                    document.querySelector('.call-status').textContent = 'Connected';
                }, 2000);
            });
        });
    }
    
    // Contact info page functionality
    if (window.location.pathname.includes('contact-info.html')) {
        // Get current contact name from page
        const contactName = document.querySelector('.profile-name').textContent;
        
        // All action buttons
        const allActionBtns = document.querySelectorAll('.contact-action-btn');
        allActionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if (!this.classList.contains('mute')) {
                    const actionText = this.querySelector('span').textContent;
                    alert(`${actionText} action clicked`);
                }
            });
        });
        
        // Quick action buttons
        const messageBtn = document.querySelector('.quick-actions .action-btn:first-child');
        const audioCallBtn = document.querySelector('.quick-actions .action-btn:nth-child(2)');
        const videoCallBtn = document.querySelector('.quick-actions .action-btn:last-child');
        
        if (messageBtn) {
            messageBtn.addEventListener('click', function() {
                // Store contact before navigating
                sessionStorage.setItem('currentContact', contactName);
                window.location.href = 'index.html';
            });
        }
        
        if (audioCallBtn) {
            audioCallBtn.addEventListener('click', function() {
                // Store contact before navigating
                sessionStorage.setItem('currentContact', contactName);
                window.location.href = 'call.html';
            });
        }
        
        if (videoCallBtn) {
            videoCallBtn.addEventListener('click', function() {
                // Store contact before navigating
                sessionStorage.setItem('currentContact', contactName);
                window.location.href = 'video-call.html';
            });
        }
        
        // Detail action buttons
        const detailCallBtn = document.querySelector('.detail-actions .detail-action-btn:first-child');
        const detailVideoBtn = document.querySelector('.detail-actions .detail-action-btn:nth-child(2)');
        const detailMessageBtn = document.querySelector('.detail-actions .detail-action-btn:last-child');
        
        if (detailCallBtn) {
            detailCallBtn.addEventListener('click', function() {
                // Store contact before navigating
                sessionStorage.setItem('currentContact', contactName);
                window.location.href = 'call.html';
            });
        }
        
        if (detailVideoBtn) {
            detailVideoBtn.addEventListener('click', function() {
                // Store contact before navigating
                sessionStorage.setItem('currentContact', contactName);
                window.location.href = 'video-call.html';
            });
        }
        
        if (detailMessageBtn) {
            detailMessageBtn.addEventListener('click', function() {
                // Store contact before navigating
                sessionStorage.setItem('currentContact', contactName);
                window.location.href = 'index.html';
            });
        }
        
        // Media items
        const mediaItems = document.querySelectorAll('.media-item');
        mediaItems.forEach(item => {
            item.addEventListener('click', function() {
                alert('Opening media item');
            });
        });
        
        const moreMediaBtn = document.querySelector('.more-media-btn');
        if (moreMediaBtn) {
            moreMediaBtn.addEventListener('click', function() {
                alert('Opening all media, links and docs');
            });
        }
        
        // Mute toggle
        const muteBtn = document.querySelector('.contact-action-btn.mute');
        if (muteBtn) {
            muteBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                const toggleSwitch = this.querySelector('.toggle-switch');
                if (toggleSwitch) {
                    // Add visual feedback for toggle
                    if (this.classList.contains('active')) {
                        toggleSwitch.style.backgroundColor = '#4e73df';
                        toggleSwitch.querySelector('.toggle-slider').style.left = '21px';
                    } else {
                        toggleSwitch.style.backgroundColor = '#e6e9f0';
                        toggleSwitch.querySelector('.toggle-slider').style.left = '1px';
                    }
                }
                alert('Notifications ' + (this.classList.contains('active') ? 'muted' : 'unmuted'));
            });
        }
    }
    
    // Function to select the correct contact in the chat list when returning from a call
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        const returnToChat = function() {
            const currentContact = sessionStorage.getItem('currentContact');
            if (currentContact) {
                // Find and click on the contact with the matching name
                const contactElements = document.querySelectorAll('.contact');
                let found = false;
                
                contactElements.forEach(contact => {
                    if (contact.querySelector('.contact-info h4').textContent === currentContact) {
                        contact.click();
                        contact.scrollIntoView({ behavior: 'smooth' });
                        found = true;
                    }
                });
                
                // If contact not found in list, just select the first one
                if (!found && contactElements.length > 0) {
                    contactElements[0].click();
                }
            }
        };
        
        // Run this function after the page has fully loaded
        window.addEventListener('load', returnToChat);
    }
    
    // Add meta viewport tag for better responsive behavior if not already present
    if (!document.querySelector('meta[name="viewport"]')) {
        const metaViewport = document.createElement('meta');
        metaViewport.name = 'viewport';
        metaViewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        document.head.appendChild(metaViewport);
    }
}); 


//CONNECT BACKEND TO FRONTEND
function submitContactForm(data) {
    fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(response => {
        console.log('Server responded:', response);
        alert('Contact info sent successfully!');
    })
    .catch(err => {
        console.error('Error sending contact info:', err);
    });
}

document.getElementById('your-form-id').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    submitContactForm({ name, email, phone });
});

