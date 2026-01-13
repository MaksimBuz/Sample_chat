import React, { useState } from 'react'
import socket from '../socket'
import style from './ChatStyle.module.css'
import classNames from 'classnames';

function Chat({ state }) {
    const { userName, roomId } = state
    const [message, setMessage] = useState('')

    const onSendMesage = (e) => {
        socket.emit('ROOM:ADD_NEW_MESSAGE', { text: message, userName, roomId })
        setMessage('')
    }

    return (
        <div className={classNames('d-flex', style.chat_wrapper)}>
            <div className={classNames(style.users_list_wrapper, 'col-4')}>
                <b>Online: {state.users.length}</b>
                <ul className={classNames(style.users_list)}>
                    {state.users.map(name => <li className={classNames()}>{name}</li>)}
                </ul>
            </div>
            <div className={classNames('col-8')}>
                {state.messages.map(message =>
                    <div className={classNames('d-flex ', style.messge_wrapper)}>
                        <p>{state.userName}</p> :<p>{message}</p>

                    </div>

                )}

                <form >
                    <textarea
                        className={classNames(style.message_text, 'form-control', 'mb-3')}
                        name=""
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder='Text message'
                    >

                    </textarea>
                    <button
                        type='button'
                        onClick={onSendMesage}
                        className={classNames('btn-primary', 'btn')}

                    >send</button>
                </form>
            </div>
        </div>
    )
}

export default Chat