import React, { useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Cell} from './Cell.jsx';
import '../styles/TickTack.css';
import socket from '../Connection/socket_connection';
import queryString from 'query-string';

export const Field = () => {
    
    const history = useHistory();

    const [game, setGame] = useState({
        field: Array(9).fill(null),
        next: false,
        active: false
    })
    const [sys_msg, setSys] = useState({
        user: '',
        message: '',
    })
    const [sys_room, setRoom] = useState(null);
    const [list_of_users, setList] = useState([]);
    const [leave, setLeave] = useState(false);

    console.log(list_of_users);

    const clickHandler = (value) => { 
        const copyField = game.field;

        const userCreds = JSON.parse(localStorage.getItem('userInfo'));

        if(getWinner(game.field) || copyField[value]) return;

        if((game.active === false && userCreds.username === list_of_users[0].username) || (game.active === false && userCreds.username === list_of_users[1].username)) {
            copyField[value] = game.next ? "X" : "O";
            

            setGame({active: true});

            socket.emit('move', {field: copyField, next: !game.next, active: false, room: sys_room});

            setGame({field: copyField})

        }

        
    }

    const LeaveHandler = () => {
        history.push('/rooms');
        setLeave(!leave);
        window.location.reload()
    }

    const drawField =(value) => { 
        return (
            <Cell onClick={() => clickHandler(value)} value={game.field[value]} key={value+1}/>
        )
    }

    const getWinner = (field) => {
        const fieldCells = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        for (let i = 0; i < fieldCells.length; i++) {
            const [a, b, c] = fieldCells[i];
            if(field[a] && field[a] === field[b] && field[a] === field[c]) return field[a];
        }
        return null;
    }

    useEffect(() => {
        
        const {room} = queryString.parse(window.location.search);
        
        setRoom(room);

        socket.on('system_msg', ({user, message}) => { 
            setSys({user, message})
        })

        socket.emit("room", room);
        
    }, [sys_msg])

    useEffect(()=> {
        socket.on('All users', (usersInRoom) => {
            setList(usersInRoom);
        })

        
    })

    useEffect(() => {
        socket.on('drawingMove', (game) => {
            
            setGame({field: game.field, next: game.next, active: game.active});
        })
    })

   const cellArr = [];

    for (let i = 0; i < 9; i++) {
        
        cellArr.push(drawField(i));
    }

    //
    const winner = getWinner(game.field);

    let modalWinner;
    if(winner) {
        modalWinner = `The winner is ${winner}`;
    }
    else { 
        modalWinner = '';
    }
    //
    
    return(
        <>
        <div className="system-wrapper">
            <h3>{sys_msg.user} {sys_msg.message}</h3>
        </div>
        <h3>Room number #{sys_room}</h3>
        <h4>{modalWinner}</h4>
        <button className="btn btn-primary w-25" onClick={()=> LeaveHandler()}>Leave the room</button> 

        <h3>Connected users:</h3>
        {list_of_users.map((user, index)=> (
            <div className="username" key={index}>{user.username}</div>
        ))}

            {list_of_users.length < 2 ? <h3>Waiting for the opponent</h3> 
            : (
                <div className="field-wrapper">
                    <div className="field">
                        {cellArr}
                    </div>
                </div>
            )
            }
        </>
    )
}