
const http = require('http')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())


app.get('*', (req, res) => {

    console.log("Ready");

});

const server = http.createServer(app)

const io = require('socket.io')(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST']
    }
})
let users = []
io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        console.log("Disconect UserId:" + socket.id)
        let buscar = users.filter((u)=>u.id==socket.id)
        if(buscar.length>0){
            let i = users.findIndex((u)=>u.id==socket.id)
            users.splice(i,1)
        }
        console.log(users)
        socket.broadcast.emit('updateOnline',users)
    });
    socket.on('newOnline', (param) => {
        let buscar = users.filter((u)=>u.user.id==param.id)
        if(buscar.length==0){
            users.push({id:socket.id,user:param})
        }
        console.log(users)
        socket.broadcast.emit('updateOnline',users)
        socket.emit('updateOnline',users)
    });
    socket.on('userChannel', (param) => {
    
        socket.broadcast.emit('userChannel:'+param,param)

    });
    socket.on('chatChannel', (param) => {
    
        socket.broadcast.emit('chatChannel:'+param,param)

    });
    socket.on('meChannel', (param) => {
    
        socket.emit('meChannel:'+param,param)

    });
    socket.on('destroyOnline', (param) => {
        let buscar = users.filter((u)=>u.user.id==param.id)
        if(buscar.length>0){
            let i = users.findIndex((u)=>u.user.id==param.id)
            users.splice(i,1)
        }
        console.log(users)
        socket.broadcast.emit('updateOnline',users)
    });
 
    console.log("UserId:" + socket.id)

})

server.listen(process.env.PORT || '3006', function () {

    console.log('Server on port 3006!')

});