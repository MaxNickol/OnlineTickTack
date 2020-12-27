import React, { useState, useEffect, useContext } from 'react';
import {Modal} from './Modal.jsx';
import {Field} from './Field';
import {RoomsContext} from '../Context/Rooms.context';
import {Switch, Route, Redirect} from 'react-router-dom';
import socket from '../Connection/socket_connection';
import axios from 'axios'
import {Spring} from 'react-spring/renderprops';

export const Rooms = () => { 


    const [modal, setModal] = useState(false);
    const [message, setMessage] = useState(null);
    const [form, setForm] = useState({
        title: '',
        description: '',
        tags: ''
    })
    const [rooms, setRooms] = useState([]);
    const [lobbyRedir, setRedir] = useState(false);
    const [lobbyId, setLobby] = useState(null);
    const [tags, setTags] = useState([]);

  

    const context = useContext(RoomsContext);

    const changeHandler = (e) => {
        setForm({...form, [e.target.id]:e.target.value});
    }

    const tagsChange = (tags) => {
        setTags(tags);
      }
 

    const roomCreate = async () => { 
        const response = await axios.post('/rooms', {
            title: form.title,
            tags: tags,
        });

        if(response.status === 201) {
            setMessage(response.data.message);
            // window.location.reload();
        }

        setModal(!modal);
    }

    const ModalHandler = () => { 
        setModal(!modal);
    }

    let modalWindow;
    if(modal) {
        modalWindow = <Modal onChange={changeHandler} toggle={ModalHandler} msg={message} tags={tags} roomCreate={roomCreate} tagsChange={tagsChange}/>
    }
    else {
        modalWindow = ''
    }

    const roomClicker = (room_id) => {

        setLobby(room_id);
       
        const userCreds = JSON.parse(localStorage.getItem('userInfo'));

        socket.emit('join_room', {room_id, userId: socket.id, username: userCreds["username"]});
    
        setRedir(true);
       
    }

    useEffect(() => { 
        
        const response = await axios.get('/rooms');
        setRooms(response.data.rooms);
        socket.on('getAllRooms', (rooms) => setRooms(rooms));

    }, [rooms]);
    

    if(lobbyRedir) return <Redirect to={`/game_lobby?room=${lobbyId}`}/>

    return (
        <>
        <Spring 
        config={{duration: 5000}}
        form={{opacity:0}}
        to={{opacity:1}}
        >
            {props => (
                <>
                    <button className="btn-width btn btn-success ml-auto mr-auto mt-5" style={props} onClick={ModalHandler}>Create a room!</button>
                        {modalWindow}
                        <div className="rooms-wrapper" style={props}>
                            {context.filtered.length === 0 ? 
                                rooms.map((room, index) => {
                                    return (
                                <div className="lobby-wrapper text-break" key={index} onClick={() => roomClicker(room.id)}>
                                        <div className="header">
                                        {room.title}
                                    </div>
                                    <div className="tags">
                                        <div className="form-control" disabled={true} >{room.tags}</div>
                                    </div>
                                </div>
                        )
                    }) 
                    :
                    context.filtered.map((room, index) => {
                        return (
                            <div className="lobby-wrapper text-break" style={props} key={index} onClick={() => roomClicker(room.id)}>
                                <div className="header text-break">
                                    {room.title}
                                </div>
                                <div className="tags text-break">
                                    <div className="form-control" disabled={true} >{room.tags}</div>
                                </div>
                            </div>
                            )
                        }) 
                    }
                    <Switch>
                        <Route path="/game_lobby">
                            <Field redir={{lobbyRedir, setRedir}}/>
                        </Route>
                    </Switch>
                </div>
                </>
            )}
        </Spring>
        
        </>
    )
}