import React, { useState, useEffect } from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import './chat.css'

import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'

let socket

const Chat = ({ location }) => {
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([])

    const ENDPOINT = 'localhost:5000'
    var connectionOptions =  {
        // Error: https://stackoverflow.com/questions/44628363/socket-io-access-control-allow-origin-error/65188436#65188436
        "force new connection" : true,
        "reconnectionAttempts": "Infinity", 
        "timeout" : 10000,                  
        "transports" : ["websocket"]
    }

    useEffect(() => {
        const { room, name} = queryString.parse(location.search)
        // console.log(data)
        // console.log(location.search)
        socket = io.connect(ENDPOINT, connectionOptions)
        // console.log(socket)

        setName(name)
        setRoom(room)

        socket.emit('join', {name, room}, () => {

        })
        
        return () => {
            socket.emit('disconnect')
            socket.off()
        }
    }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })

        socket.on('roomData', ({ users }) => { setUsers(users) })

    }, [messages])

    //function for sending messages
    const sendMessage = (event) => {
        event.preventDefault()
        if(message){
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages)

    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />                
            </div>
            {/* {console.log('user info:', users)} */}
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat 