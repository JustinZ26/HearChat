# HearChat

Messaging app designed for visually impaired user

## Tech Stack

**Frontend:** HTML, CSS, JS

**Backend:** Node.js, Express

**Database:** Microsoft MySQL


## Current Features

1. **Unread message announcement:** when user first enter the app, the app will announce how many unread messages the user has
2. **Hold to voice command:** if user hold anywhere on the screen for 2 seconds, the app will run voice recognition command that will record the user's command. currently, the avaiable command are "reply" to send message, "who" to check who is the other party, "navigate" to change chatroom, "read" to read last x mesaggess, and "test" purely to test the ASR model
3. **TTS text bubble:** the text bubble in the chatroom can be clicked, when clicked the program will run a TTS that read out loud that message's content


## Future's Work:

1. **More command:** add more voice activated command to call or video call a person, check their user profile, etc
2. **Add TTS and ASR Model:** Currently we still depend on the avaiable web model which might not be avaiable in all browser or devices, by implementing our own model we can make the app more stable and usable by all users
3. **Other media:** Upgrade our app so it can support attachment like picture, video, voice message, and other files
