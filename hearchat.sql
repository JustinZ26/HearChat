CREATE DATABASE hearchat;
USE hearchat;

CREATE TABLE user (
	id INT PRIMARY KEY,  
	name VARCHAR(100),
    avatar VARCHAR(255),
    status VARCHAR(10)
);

CREATE TABLE contacts (
	id INT PRIMARY KEY,         
	name VARCHAR(100),
	avatar VARCHAR(255),
	status VARCHAR(10),
	last_message VARCHAR(255),
	time VARCHAR(10),
	unread INT
);

CREATE TABLE messages (
    contact_id INT,              
    sender VARCHAR(10),
    text TEXT,
    time VARCHAR(10),
    FOREIGN KEY (contact_id) REFERENCES contacts(id)
);

INSERT INTO user (id, name, avatar, status) 
VALUES (1, 'Jhansen', 'asset/icon-dummy.png', 'online');

INSERT INTO contacts (id, user_id, name, avatar, status, last_message, time, unread) VALUES
(1, 'Erlangga', 'asset/icon-dummy.png', 'online', 'Let me think about it.', '5:57 PM', 3),
(2, 'JingkoisReal', 'asset/icon-dummy.png', 'offline', 'I''ll be there in 10 minutes.', '6:42 PM', 1),
(3, 'Kelra', 'asset/icon-dummy.png', 'offline', 'hello', '6:07 PM', 0),
(4, 'JingkoGod', 'asset/icon-dummy.png', 'offline', 'I''ll check and get back to you.', '6:31 PM', 0);

INSERT INTO messages (id, contact_id, sender, text, time) VALUES
(1, 'them', 'Hey, how''s it going?', '10:30 AM'),
(1, 'me', 'Hi Erlangga! I''m doing well…', '10:32 AM'),
(2, 'them', 'Hey, how''s it going?', '10:30 AM'),
(2, 'me', 'Hi JingkoisReal! I''m doing well…', '10:32 AM'),
(3, 'them', 'Hey, how''s it going?', '10:30 AM'),
(3, 'me', 'Hi Kelra! I''m doing well…', '10:32 AM'),
(4, 'them', 'Hey, how''s it going?', '10:30 AM'),
(4, 'me', 'Hi JingkoGod! I''m doing well…', '10:32 AM'),
(4, 'me', 'hey how is it going', '6:31 PM'),
(4, 'them', 'I''ll check and get back to you.', '6:31 PM');

