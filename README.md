# chat_app
This is a chatting app that utilizes React.js as the front-end and express.js as the server. I used Socket.IO to create a communication channel between the client and the server. 

## Demo
Let's run this application. This repo only contains the express and React files, so make sure you have the package.json files and dependencies set up. Note that the client is run on PORT 3000 and the server is run on PORT 8000. I opened two windows (one in incognito mode) for the demonstration.
<p align="center">
<img width="600" alt="Screen Shot 2024-02-13 at 7 29 25 PM" src="https://github.com/sungmogi/chat_app/assets/131221622/629d2cdb-6b4a-4243-aa7b-e906b32fad16">
</p>

The home directory is where you will type in your username and click the "Enter Chat" button to start chatting.
<p align="center">
<img width="600" alt="Screen Shot 2024-02-13 at 7 30 45 PM" src="https://github.com/sungmogi/chat_app/assets/131221622/5148f536-4376-407e-a2f7-0b027c782267">
</p>

Two users have logged in: Sungmogi and Babo. 
<p align="center">
<img width="600" alt="Screen Shot 2024-02-13 at 7 31 20 PM" src="https://github.com/sungmogi/chat_app/assets/131221622/af8a2952-8d45-4e1a-85ed-58e4c5c501dd">
</p>

Sungmogi and Babo say hi and introduce themselves to each other. 
<p align="center">
<img width="600" alt="Screen Shot 2024-02-13 at 7 31 38 PM" src="https://github.com/sungmogi/chat_app/assets/131221622/0071ccda-b9d6-46f0-9911-3b99c3a16fc7">
</p>

Sungmogi logs out and Babo is notified that Sungmogi has left the chat. 

## Code Explained

### Express (server.js)
```
const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
```
We import the required libraries. We need express for the server (obviously) and cors for the cross-origin request. From the socket.io library, we import the Server class. 

```
const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});
```
We create an instance of express, pass in cors as the middleware, and create an HTTP server using this express app. We then create an instance of the socket.io Server, configured with the created HTTP server and some cors options. We specify the origin (where the client is run) and methods (as we will make GET and POST requests). 

```
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log("A user disconnected");
    });
    socket.on('send_message', (data) => {
        socket.broadcast.emit('receive_message', data);
    });
    socket.on('user_update', (data) => {
        socket.broadcast.emit('receive_notice', data);
    })
});
```
This is the server-side event handler. This event handler is triggered when a client connects to the server. The event handler is listening for three events: 'disconnect' (when a user disconnects), 'send_message' (when a user sends a message), and 'user_update' (when a user enters or leaves the chat).

### React (src/App.jsx)
```
import './App.css';
import io from 'socket.io-client';
import Home from './Home';
import Chat from './Chat'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
```
We import some required functions. We import the client-side socket.io to connect with the server. We also use two components for this React app, Home and Chat. We then import some functions from react-router-dom for navigation. 

```
function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>Chat</h1>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/chat' element={<Chat />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
```
We have two Routes for the two components. 

### React (src/Home.jsx)
The Home component is where the user will enter their username and enter chat. 
```
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import io from 'socket.io-client';
```
We import useState so that we can keep track of the username typed in by the user. We import useNavigate so the user can navigate to the other component Chat. 

```
const socket = io.connect('http://localhost:8000');

export default function Home() {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const updateUserName = (evt) => {
        setUserName(evt.target.value);
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (userName) {
            localStorage.setItem('userName', userName);
            navigate('/chat');
            socket.emit('user_update', {user: userName, status: 'entered'});
        }
        else {
            alert('Please Enter Username!');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="userName">Enter Username: </label>
                <input id="userName" placeholder="Username" name="userName" value={userName} onChange={updateUserName}></input>
                <button>Enter Chat</button>
            </form>
        </>
    )
}
