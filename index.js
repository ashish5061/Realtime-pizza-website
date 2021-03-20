require('dotenv').config();
const express = require ('express')
const app = express()
const ejs = require("ejs")
const path = require('path')
const expressLayout= require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session');
const flash = require('express-flash')
const PORT = process.env.PORT|| 3000
const MongoStore = require("connect-mongo");
const  passport = require('passport')
const Emitter = require('events')
//Database connection
const url = ' mongodb+srv://Ashish:anger@cluster0.dlzt9.mongodb.net/test';
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
})


const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)


// session config
app.use(session({
    secret: 'Nepali',
    resave: false,
   
    store: MongoStore.create({ mongoUrl:' mongodb+srv://Ashish:anger@cluster0.dlzt9.mongodb.net/test' }),
    saveUninitialized: false,
    cookie: {maxAge: 1000*60*60*24} //24hrs
  
  }));

  const passportInit= require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


  app.use(express.json())
  app.use(express.urlencoded({extended: false}))



app.use(flash())

app.use(express.static('public'))


app.use((req, res, next)=> {
    res.locals.session= req.session
    res.locals.user= req.user

    next()
})

app.use(expressLayout);
app.set('views', path.join(__dirname, 'resources/views'))
 
app.set('view engine', 'ejs');





require ('./routes/web')(app)

const server = app.listen(PORT, () => {
    console.log(`listening on port ${3000}`)
})

const io = require("socket.io")(server);
io.on('connection',(socket) => {
  socket.on('join', (RoomName) => {
     socket.join(RoomName)
  })
})

eventEmitter.on('orderUpdated',(data)=> {

  io.to(`order_${data.id}`).emit('orderUpdated', data)

})


eventEmitter.on('orderPlaced',(data)=> {

  io.to('adminRoom').emit('orderPlaced', data)

})