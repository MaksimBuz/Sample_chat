import React, { useState } from 'react'
import socket from '../socket'
import axios from 'axios'


function JoinBlock({ onLogin }) {
    const [roomId, setRoomId] = useState('')
    const [userName, setUserName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const onEnter = async () => {
        if (!roomId || !userName) {
            return
        }
        const obj = { roomId, userName }
        setIsLoading(true)
        await axios.post('http://localhost:3000/rooms',obj)
        onLogin(obj)

    }

    return (
        <div className='d-flex flex-column '>
            <input
                type="text"
                name=""
                id=""
                placeholder='room id'
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
                className="form-control mb-3"
            />
            <input
                type="text"
                name=""
                id=""
                placeholder='user name'
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="form-control mb-3"
            />
            <button
                disabled={isLoading}
                type="button" class="btn btn-success"
                onClick={onEnter}
            >Success</button>
            {isLoading ? 'Вход...' : 'Войти'}
        </div>
    )
}

export default JoinBlock