const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false}))
app.use(express.static('views'))
app.use(express.static('views/css'))
app.use(cookieParser())

const items = [
  { id: 0, name: 'Apple', description: 'Juicy and crispy apple.', price: 3 },
  { id: 1, name: 'Banana', description: 'A yellow and healthy fruit', price: 2 },
  { id: 2, name: 'Strawberry', description: 'Juicy and sweet strawberry.', price: 4 },
  { id: 3, name: 'Orange', description: 'A citrusy and refreshing orange.', price: 3 },
  { id: 4, name: 'Peach', description: 'Juicy and sweet peach.', price: 5 },
  { id: 5, name: 'Grapes', description: 'Plump and sweet grapes.', price: 4 },
  { id: 6, name: 'Watermelon', description: 'Juicy and refreshing watermelon.', price: 6 },
  { id: 7, name: 'Mango', description: 'Juicy and sweet mango.', price: 7 },
  { id: 8, name: 'Blueberry', description: 'Tasty and healthy blueberry.', price: 5 },
  { id: 9, name: 'Kiwi', description: 'Tasty and healthy kiwi.', price: 3 }
]

/* ----------- functions ----------- */

function logincheck(username,password,callback) {

  fs.readFile('users.json', 'utf8', (err, data) => {
    const userslocal = JSON.parse(data)

    let found = false
    for (const user of userslocal) {
      console.log(username,password,user.username,user.password)
      if (user.username === username && user.password === password) {
        found = true
        break
      }
    }
    callback(found)
  })
}

function savedata(newData) {
  fs.readFile('users.json', 'utf8', (error, data) => {
    const existingData = JSON.parse(data)
    existingData.push(newData)
    
    fs.writeFile('users.json', JSON.stringify(existingData), (error) => {
      console.log('Data added to file')
      users.length = 0
        }
      )
      })
  }

  function addtocart(newData, user) {
    try {
      fs.readFile('./usercarts/' + user + 'cart.json', 'utf8', (err) => {
        if (err) throw err
        console.log('found')
    })} catch (error) {
      fs.writeFile('./usercarts/' + user + 'cart.json', '[]', (err) => {
        console.log('not found')
        if (err) throw err
      })
    }
    fs.readFile('./usercarts/' + user + 'cart.json', 'utf8', (error, data) => {
      const existingData = JSON.parse(data)
      existingData.push(newData)
  
      fs.writeFile('./usercarts/' + user + 'cart.json', JSON.stringify(existingData), (error) => {
        console.log('Fruit added to file')
        }
      )
    })
  }
  
/* ----------- web pages ----------- */
app.get('/',function(req,res){
  res.render(path.join(__dirname +'/views/htmlfile.ejs'))
})

app.get('/login',function(req,res){
  res.render(path.join(__dirname +'/views/login.ejs'))
})

app.get('/storepage', function(req, res) {
  try {
    var username = req.cookies.user || res.redirect('/login')
  } catch {
      res.redirect('/')
    }
  res.render(path.join(__dirname + '/views/storefront.ejs'), { items: items, username: username })
})

app.get('/cart', function(req, res) {
  try {
    req.cookies.user || res.redirect('/login')
    var currentCart = JSON.parse(fs.readFileSync('./usercarts/' + req.cookies.user + 'cart.json', 'utf8'))
  } catch {
    var currentCart = []
  }
  res.render(path.join(__dirname + '/views/cart.ejs'), { currentCart: currentCart })
})

app.get('/register', function(req,res){
  error = req.cookies.error || ''
  console.log(error)
  res.render(path.join(__dirname +'/views/register.ejs'), {error : error})
  req.body.username
  req.body.password
})

app.post('/login', function(req, res) {
  const usernameTemp = req.body.username
  const passwordTemp = req.body.password

  logincheck(usernameTemp, passwordTemp, function(result) {
    if (result) {
      console.log(usernameTemp)
      res.cookie('user', usernameTemp, {maxAge: 720000})
      res.redirect(`/storepage`)
    } else {
      res.redirect('/register')
    }
  }
)})

app.post('/add-to-cart', function(req, res) {
  req.cookies.user || res.redirect('/login')
  const currentCart = req.cookies.cart || []
  const itemId = parseInt(req.body['item-id'])
  console.log(itemId)
  let item = items.find(i => i.id === itemId)
  currentCart.push(item)
  console.log(item)
  addtocart(item, req.cookies.user)
  res.redirect('/cart')
})

app.post('/clear-cookies', function(req, res) {
  fs.readFile("cart.json", 'utf8', () => {
    NewData = '[]'
    fs.writeFile('./usercarts/' + req.cookies.user + 'cart.json', NewData, () => {
      console.log("Cart cleared")
    })
  })
  res.redirect('/cart')
})

app.post('/register', function(req, res) {
  let users = ({
    username: req.body.username,
    password: req.body.password
  })
  fs.readFile('users.json', 'utf8', (err, data) => {
    const content = JSON.parse(data)
    for (const usr of content) {
      if (usr.username === req.body.username) {
        res.cookie('error', 'User already exists', {maxAge: 3000})
        res.redirect('/register')
        return
      }
    }
  })
  console.log(users)
  savedata(users)
  res.redirect('/login')
})

app.listen(3000)