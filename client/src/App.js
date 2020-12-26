import React, { useState } from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
// import {TickTack} from './components/TickTack';
import {Login} from './components/Login.jsx';
import {Navbar} from './components/NavBar.jsx';
import {Rooms} from './components/Rooms.jsx';
import {Field} from './components/Field.jsx';
import {useLogin} from './hooks/useLogin';
import {AuthContext} from './Context/Auth.context';
import {RoomsContext} from './Context/Rooms.context';

import axios from 'axios';

import "./styles/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  const {token, login, logout, userId, nickname} = useLogin();

  const [reload, setReload] = useState(false);

  const [tags, setTags] = useState([]);

  const [filtered, setFiltered] = useState([]);

  let isAuth = !!token;


  const handleChange = (tags) => {
       setTags(tags)
     }


  const filterHandler = async () => {
    try{
      const response = await axios.post('/filtered_rooms', {tags});

      setFiltered(response.data.rooms);
      
      setTags([]);
    }
    catch(err) {
      console.log(err.response.data.error)
    }
  }
  

  return (
    <div className="App">
     <Router>
       <AuthContext.Provider value={{token, login, logout, userId, reload, setReload, isAuth, nickname}}>
       <RoomsContext.Provider value={{filtered, setFiltered}}>
        <Navbar onClick={filterHandler} onChange={handleChange} tags={tags}/>
        {isAuth ?
            <Switch>
              <Route exact path="/rooms"  component={Rooms} />
              <Route path="/game_lobby" >
                <Field />
              </Route>
              <Redirect to="/rooms" />
            </Switch>
            :
          <Switch>
            <Route path="/login" component={Login} />
            <Redirect from="/" to="/login" />
          </Switch>
            }
        </RoomsContext.Provider>
        </AuthContext.Provider>
     </Router>
    </div>
  );
}

export default App;
