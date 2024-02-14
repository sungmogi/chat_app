import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import io from 'socket.io-client';

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