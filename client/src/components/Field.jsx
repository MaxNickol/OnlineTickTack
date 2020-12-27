import React, { useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Cell} from './Cell.jsx';
import '../styles/TickTack.css';
import socket from '../Connection/socket_connection';
import queryString from 'query-string';
import {Spring} from 'react-spring/renderprops';

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

        if(field.includes(null) == false) return false;
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
    else if(winner === false) {
        modalWinner = "It's draw!"
    }
    else { 
        modalWinner = '';
    }
    //
    
    return(
        <>
        {sys_msg.message ? 
        (<Spring 
            config={{duration: 2000}}
            from={{opacity:0, marginTop: -500}}
            to={{opacity:1, marginTop: 35}}
            >
                {props => <div className="system-wrapper" style={props}>
                            <p className="system-message">{sys_msg.message}</p>
                        </div>}
            </Spring>) : ''
        }
        
        <Spring
        config={{duration: 800}}
        from={{opacity:0, marginLeft:500}}
        to={{opacity:1, marginLeft:10}}>
            {props => (
                <div className="wrapper" style={props}>
                <p>Room number #{sys_room}</p>
                <p>{modalWinner}</p>
                </div>
            )}
           
        </Spring>
       
       <Spring
       config={{duration: 800}}
       from={{opacity: 0, marginLeft: -500}}
       to={{opacity:1, marginLeft: 10}}
       >
           {props => (
               <>
                <button style={props} className="btn btn-primary btn-wrap" onClick={()=> LeaveHandler()}>Leave the room</button> 
                <div style={props} className="connected-wrapper">
                    <p>Connected users:</p>
                        {list_of_users.map((user, index)=> (
                            <div className="users-list" key={index}>{user.username}</div>
                        ))}
                </div>
                </>
           )}
       
        </Spring>
                {list_of_users.length < 2 ? <h3 className="ml-2 mt-5">Waiting for the opponent...</h3> 
                : 
                <Spring
                config={{duration: 1000}}
                from={{opacity:0}}
                to={{opacity:1}}
                >
                    {props => (
                        <div className="field-wrapper" style={props}>
                            <div className="field">
                                {cellArr}
                            </div>
                    </div>
                    )}
                </Spring>
                }
       
        </>
    )
}