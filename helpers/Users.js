const users = [];

const addUser = (user) => { 

    const foundUser = users.find(player => player.username === user.username && player.room === user.room);

    if(foundUser) return {error: "Username is already in the room!"};

    users.push(user);

    console.log(users)
    return user;
}


const removeUser = username => {
    // const found = users.find(player => player.userId == user.userId);
    const found = users.find(user => user.username == username);

    if(found) {
        const userIndex = users.indexOf(found);

        const spliced = users.splice(userIndex, 1);

        return spliced;
    }

    return null;
    
}


const getUsersInRoom = (room_id) => {
   
    const foundUsers = users.filter(player => player.room_id == room_id);

    return foundUsers;
}

module.exports = {addUser, removeUser, getUsersInRoom}