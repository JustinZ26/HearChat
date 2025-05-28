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
    
    // Send button functionality
    const sendBtn = document.querySelector('.send-btn');
    const messageInput = document.querySelector('.message-input input');
    
    function sendMessage() {
        const messageText = messageInput.value.trim();
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
            
            // Simulate reply after 1-2 seconds
            setTimeout(simulateReply, Math.random() * 1000 + 1000);
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
    function simulateReply() {
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
            
            // Get current time
            const now = new Date();
            const hours = now.getHours() % 12 || 12;
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
            const timeString = `${hours}:${minutes} ${ampm}`;
            
            // Create new message element
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
            
            // Add message to chat
            messagesContainer.appendChild(newMessage);
            
            // Scroll to bottom of chat
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
        microphoneBtn.addEventListener('click', function() {
            alert('Voice message feature clicked');
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

