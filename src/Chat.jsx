import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const socket = io.connect('http://localhost:8000');

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messagesToDisplay, setMessagesToDisplay] = useState([]);

    const userName = localStorage.getItem('userName');
    const navigate = useNavigate();

    const updateMessage = (evt) => {
        setMessage(evt.target.value);
    };

    const sendMessage = (evt) => {
        evt.preventDefault();
        if (message) {
            socket.emit('send_message', { userName, message });
            setMessagesToDisplay((curr) => [...curr, {user: 'Me', message: message}]);
            setMessage('');
        }
        else {
            alert('Please Type In Something!');
        }
    };

    const logOut = () => {
        localStorage.removeItem('userName');
        navigate('/');
        socket.emit('user_update', {user: userName, status: 'left'});
    };

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessagesToDisplay((curr) => [...curr, {user: data.userName, message: data.message}]);
        });
        socket.on('receive_notice', (data) => {
            setMessagesToDisplay((curr) => [...curr, {user: '', message: `${data.user} has ${data.status}`}]);
        });
        return () => {
            socket.off('receive_message');
            socket.off('receive_notice');
        };
    }, [socket]);

    return (
        <>
            <h2>Welcome, {userName}.</h2>
            <form onSubmit={sendMessage}>

                {messagesToDisplay && 
                <ul>
                    {messagesToDisplay.map((msg, idx) => (
                        msg.user ? <li key={idx}>{msg.user}: {msg.message}</li> : <li key={idx}><b>{msg.message}</b></li>
                    ))}    
                </ul>}
                <input placeholder='message' onChange={updateMessage} value={message}></input>
                <button>Send Message</button>
            </form>
            <button onClick={logOut}>Log Out</button>
        </>
    );
}
