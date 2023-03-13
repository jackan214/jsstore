const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

var rootRouter = require("./routes/root")
var loginRouter = require("./routes/login")
var registerRouter = require("./routes/register")
var cartRouter = require("./routes/cart")
var storepageRouter = require("./routes/storepage")
var settingsRouter = require("./routes/settings")

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(express.static('views'))
app.use(express.static('views/css'))
app.use(cookieParser())
  
app.use('/', rootRouter)
app.use('/login', loginRouter)
app.use('/storepage', storepageRouter)
app.use('/settings', settingsRouter)
app.use('/cart', cartRouter)
app.use('/register', registerRouter)

app.listen(3000)