# HearChat

**HearChat** is a web-based messaging app designed with visually impaired users in mind, provided with voice activated commands and text-to-speech features. This app ensures users can navigate and communicate with ease even without relying on visuals

## Tech Stack

**Frontend:** HTML, CSS, JS

**Backend:** Node.js, Express

**Database:** MySQL


## Current Features

1. **Hold to voice command:** User can hold anywhere on the screen for 1 seconds, the app will run voice recognition command that will record the user's command. currently, the available commands are:
  - **"reply"** — send a message.
  - **"unread"** — announce the number of unread messages.
  - **"who"** — identify the who is the other party.
  - **"navigate"** — switch to a different chatroom.
  - **"message"** — read the last X number of messages.
  - **"test"** — purely to test the speech recognition model.
    
2. **TTS text bubble:** the text bubble in the chatroom can be clicked, when clicked the program will run a TTS that read out loud that message's content


## Future's Work

1. **More command:** add more voice activated command to call or video call a person, check their user profile, and many more
2. **Add TTS and ASR Model:** currently we still depend on the available web model which might not be available in all browser or devices, by implementing our own model we can make the app more stable and usable by all users and devices
3. **Other media:** upgrade our app so it can support attachment like picture, video, voice message, and other files such as .pdf and .doc
