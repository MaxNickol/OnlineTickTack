const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const io = require('socket.io')(server, {
    cors: {
        origin: "https://guarded-wave-01892.herokuapp.com",
    }
});
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('./config/keys');
const db = require('./models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {addUser, removeUser, getUsersInRoom} = require('./helpers/Users');


//Setting up the server cofing;
const port = process.env.PORT || 5000;

const onListening = () => { 
    const address = server.address();

    const listener = `Listening on port ${address.port}`;

    console.log(listener)
}

server.on('listening', onListening);


if(process.env.NODE_ENV == 'production') {
    app.use(express.static('client/build'));

    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

db.sequelize.sync().then(() => { 
    server.listen(port);
}).catch(e => console.log(e));

io.on('connection', async (socket) => {
    console.log(`User has been connected! ${socket.id}`);

    const rooms = await db.room.findAll();

    io.emit('getAllRooms', rooms);

    socket.on('join_room', (user) => { 

        socket.join(user.room_id)
        
        socket.name = user.username;
        const player = addUser(user);

        if(player.error) {
            socket.emit('Error happened', player.error);
        }

        socket.broadcast.to(user.room_id).emit('system_msg', {user:"System", message:`${user.username} has connected to the room!`});
    });

    socket.on('room', (room) => { 

        const usersInRoom = getUsersInRoom(room);
            // io.to(+room).emit('waiting', {usersInRoom, message: "Waiting for opponent"});

            io.to(+room).emit("All users", usersInRoom)
        
    })

    socket.on('move', ({field, next, active, room}) => {
        
        socket.broadcast.to(+room).emit('drawingMove', {field, next, active})
        
    })

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} has been removed from the server!`);

        removeUser(socket.name);
    })
})

app.use(cors());
app.use('*', cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.post('/auth/login', async (req, res) => {
    const username = req.body.username.trim();
    const password = req.body.password.trim();
    
    const user = await db.user.findOne({where: {username: username}});
    
    if(user) { 
        const comparedPassword = bcrypt.compareSync(password, user.password);

        if(comparedPassword) { 
           const token = jwt.sign({
               username: user.username,
               userId: user.id,
           }, key.jwt, {expiresIn: 60*60});

           res.status(200).json({token: `Bearer ${token}`, userId: user.id, username: user.username});
        }
        else { 
            res.json({error: "Invalid password!"});
        }
    }
    else { 
        res.json({error: "No such user!"});
    }    
})

app.post('/auth/register', async (req, res) => { 
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    const user = await db.user.findOne({where: {username: username}});
    

    if (user) { 
        res.status(500).json({error: "This username is occupied!"})
    }
    else{
            const salt = bcrypt.genSaltSync(4);
    
            const cryptedPassword = bcrypt.hashSync(password, salt);
    
            await db.user.create({
                username: username,
                password: cryptedPassword
            });

            const user = await db.user.findOne({where: {username: username}});
            if(user) {
                const token = jwt.sign({
                    username: user.username,
                    userId: user.id,
                }, key.jwt, {expiresIn: 60*60});
                res.status(200).json({token: `Bearer ${token}`, userId: user.id, username: user.username});
            } 
}
})

app.get('/rooms', async (req, res) => { 

    const rooms = await db.room.findAll();

    res.status(200).json({rooms: rooms});

})

app.post('/rooms', async (req, res) => { 

    const title = req.body.title.trim();
    const tags = req.body.tags;

    await db.room.create({
        title: title,
        tags: tags.join(' ')
    })

    res.status(201).json({message: "The room has been created!"})

})


app.post('/filtered_rooms', async (req, res) => {
    
    const tags = req.body.tags;
    

    Array.from(tags);

    try{
        const rooms = await db.room.findAll();
    
        const matchedRooms = new Set();
        rooms.forEach(room => {
            let match = true;
            tags.forEach(tag => {
                if(room.tags.indexOf(tag) === -1) match = false;
                else{
                    matchedRooms.add(room);
                }
            });
        });        

        if(matchedRooms.size > 0) {
            res.status(200).json({rooms: Array.from(matchedRooms)});
        }
        else { 
            res.status(500).json({error: "No matches!"})
        }
        
    }
    catch(err) {
        res.status(500).json({error: err})
    }
   



})

