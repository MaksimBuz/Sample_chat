import React, { useState } from 'react'
import JoinBlock from './components/JoinBlock'

import socket from './socket'
import { useReducer } from 'react'
import reducer from './reducer'
import Chat from './Chat/Chat'
import axios from 'axios'

function App() {

  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [''],

  })

  const onLogin = async (obj) => {
    dispatch({ type: 'JOINED', payload: obj })
    socket.emit('ROOM:JOIN', obj)
    const { data } = await axios.get(`http://localhost:3000/rooms/${obj.roomId}`)
    setUsers(data.users)

  }

  window.socket = socket

  const setUsers = (users) => {
    dispatch({ type: 'SET_USERS', payload: users })
  }

  React.useEffect(() => {
    socket.on('ROOM:SET_USERS', (users) => { setUsers(users) })
    socket.on('ROOM:NEW_MESSAGE', (data) => {
      console.log(data, 'data')
      dispatch({ type: 'NEW_MESSAGE', payload: data.text })

    })

  }, [])

  return (
    <div className='container d-flex align-items-center min-vh-100 justify-content-center'>
      {!state.joined ? <JoinBlock onLogin={onLogin} /> : <Chat state={state} />}

    </div>
  )
}

export default App
