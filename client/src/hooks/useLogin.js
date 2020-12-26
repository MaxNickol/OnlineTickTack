import { useState, useCallback, useEffect } from 'react'


export const useLogin = () => {

    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [nickname, setNickname] = useState(null);

    const userInfo = "userInfo"

    const login = useCallback ((jwt, id, nickname) => { 
        setToken(jwt);
        setUserId(id);
        setNickname(nickname);
        
        localStorage.setItem(userInfo, JSON.stringify({userId: id, token:jwt, username: nickname}));
    }, [])

    const logout = useCallback (() => { 
        setToken(null);
        setUserId(null);
        setNickname(null);

        localStorage.removeItem(userInfo);
    }, [])

    useEffect(() => { 
        let data = JSON.parse(localStorage.getItem(userInfo));

        if(data && data.token) { 
            login(data.token, data.userId, data.username);
        }

    }, [login])


    return {login, logout, token, userId, nickname}
}