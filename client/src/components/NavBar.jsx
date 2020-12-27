import React from 'react';
import { useContext } from 'react';
import {Link} from 'react-router-dom';
import {AuthContext} from '../Context/Auth.context';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

export const Navbar = ({onClick, onChange, tags}) => { 

    const context = useContext(AuthContext);
    

    const clickHandler = () => {
        context.logout();
    }


    let btn;
    let block;
    if(context.isAuth) {
        btn = <button className="btn btn-danger ml-3" onClick={clickHandler}>Log out!</button>
        block = (
                <>
                    <div className="username mr-5">You: {context.nickname}</div>
                    <div className="search d-flex flex-row justify-content-center align-items-center">
                        <TagsInput value={tags} onChange={onChange} className="form-control control ml-5 text-center d-flex flex-row align-items-center" />
                        <button className="btn btn-warning ml-1" onClick={() => onClick()}>Filter!</button>
                    </div>
                </>
        )
    }
    else{
        btn = '';
        block= null;
    }

        return(
            <>
            <nav className="navbar navbar-expand navbar-light bg-success">
               {block}
                <div className="items-wrapper">
                    <Link className="navbar-brand pt-0" to="/rooms" onClick={() => window.location.reload()}>Tick-Tack</Link>
                    <Link className=" rooms pt-0 " to="/rooms" onClick={() => window.location.reload()}>Rooms</Link>       
                    {btn}
                </div>
            </nav>
            </>
        ) 
}