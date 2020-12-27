import React, { useContext, useState } from 'react';
import {AuthContext} from '../Context/Auth.context';
import axios from 'axios';



export const Login = () => { 

    //hooks
    const [input, setInput] = useState({
        username: '',
        password: ''
    })

    const context = useContext(AuthContext);

    const [message, setMessage] = useState('');

    const changeHandler = (event) => { 
        setInput({...input, [event.target.id]: event.target.value});
    }

    const clickLogin = async() => {

        try{ 
            const response = await axios.post('/auth/login', {
                username: input.username,
                password: input.password
            });
            
            if(response.data) {
                
                context.login(response.data.token, response.data.userId, response.data.username);
                setMessage(response.data.error);
                // setTimeout(() => window.location.reload(), 1500);
            }
            else if(response.data.error) {
                setMessage(response.data.error)
            } 
            
        }
        catch(error) { 
            console.log(error)
        }
        

    }

    const clickRegister = async() => { 
        try{ 
            const response = await axios.post('/auth/register', {
                username: input.username,
                password: input.password
            });

            if(response.data.token) {
                context.login(response.data.token, response.data.userId, response.data.username);
                window.location.reload();
            }

        }
        catch(error) {
            setMessage(error.response.data.error) 
        }
    }

    return(
        <div className="Login-wrapper">
            <div className="login-header">
                <h3 className="text-center pb-5 mb-5">Authorization</h3>
            </div>
            <div className="content">
                <div className="input-wrapper pb-4">
                    <span className="input-group-text" id="addon-wrapping">!</span>
                    <input type="text" className="form-control" placeholder="Username" id="username" onChange={changeHandler}/>
                </div>
                <div className="input-wrapper">
                    <span className="input-group-text" id="addon-wrapping">!</span>
                    <input type="password" className="form-control" placeholder="Password" id="password" onChange={changeHandler}/>
                </div>
                <h5>{message}</h5>
                <div className="btn-group mt-5" role="group" aria-label="Basic mixed styles example">
                <button className="btn btn-warning" onClick={clickLogin}>Login</button>
                    <button className="btn btn-success" onClick={clickRegister}>Register</button>
                </div>
            </div>
        </div>
    )
}