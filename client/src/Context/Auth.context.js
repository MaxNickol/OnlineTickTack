import React from 'react'


function noop () {}

export const AuthContext = React.createContext({
    isAuth: false,
    token: null,
    userId: null,
    login: noop,
    logout: noop,

})