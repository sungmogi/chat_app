import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import Home from './Home';
import Chat from './Chat'
import { BrowserRouter, Routes, Route} from 'react-router-dom';

const socket = io.connect('http://localhost:8000');
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
