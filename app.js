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

let items
fs.readFile('./products.json', 'utf8', function(err, data){
  items = JSON.parse(data)
})

// [
//   { id: 0, name: 'Apple', description: 'Juicy and crispy apple.', price: 3 },
//   { id: 1, name: 'Banana', description: 'A yellow and healthy fruit', price: 2 },
//   { id: 2, name: 'Strawberry', description: 'Juicy and sweet strawberry.', price: 4 },
//   { id: 3, name: 'Orange', description: 'A citrusy and refreshing orange.', price: 3 },
//   { id: 4, name: 'Peach', description: 'Juicy and sweet peach.', price: 5 },
//   { id: 5, name: 'Grapes', description: 'Plump and sweet grapes.', price: 4 },
//   { id: 6, name: 'Watermelon', description: 'Juicy and refreshing watermelon.', price: 6 },
//   { id: 7, name: 'Mango', description: 'Juicy and sweet mango.', price: 7 },
//   { id: 8, name: 'Blueberry', description: 'Tasty and healthy blueberry.', price: 5 },
//   { id: 9, name: 'Kiwi', description: 'Tasty and healthy kiwi.', price: 3 }
// ]

/* ----------- functions ----------- */

function logincheck(username, password, res, callback) {

  fs.readFile('users.json', 'utf8', (err, data) => {
    const userslocal = JSON.parse(data)

    let found = false
    for (const user of userslocal) {
      console.log(username,password,user.username,user.password)
      if (user.type === 'admin') {
        res.cookie('admin', 'admin', {maxAge: 720000})
      }
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
        }
      )
      })
  }

// function addtocart(newData, user) {
//   fs.readFile('./usercarts/' + user + 'cart.json', 'utf8', (err, data) => {
//     if (err) {
//       fs.writeFile('./usercarts/' + user + 'cart.json', '[]', (err) => {
//         console.log('File not found, creating file')
//       })
//     } else {
//       const existingData = JSON.parse(data)
//       existingData.push(newData)

//       fs.writeFile('./usercarts/' + user + 'cart.json', JSON.stringify(existingData), (err) => {
//         console.log('Fruit added to file')
//       })
//     }
//   })
// }
  
function addtocart(newData, user) {
  fs.readFile('usercarts.json', 'utf8', (err, data) => {
    console.log(data)
    let usercarts = {}
    usercarts = JSON.parse(data)
    usercarts[user] = usercarts[user] || []
    usercarts[user].push(newData)
    
    fs.writeFile('usercarts.json', JSON.stringify(usercarts), function(err) {
      if (err) {
        console.error(err)
      } else {
        console.log(usercarts)
        console.log('Fruit added to file')
      }
    })
  })
}

  
/* ----------- web pages ----------- */
app.get('/',function(req,res){
  if (req.cookies.user) {
    res.redirect('/storepage')
  }
  res.render(path.join(__dirname +'/views/htmlfile.ejs'))
})

app.get('/login',function(req,res){
  if (req.cookies.user) {
    res.redirect('/storepage')
  }  
  res.render(path.join(__dirname +'/views/login.ejs'))
})

app.get('/storepage', function(req, res) {
  try {
    var username = req.cookies.user || res.redirect('/login')
  } catch {
      res.redirect('/')
  }
  if (req.cookies.admin) {
    username = 'admin'
  }
  res.render(path.join(__dirname + '/views/storefront.ejs'), { items: items, username: username })
})

app.get('/settings', function(req, res) {
  req.cookies.user || res.redirect('/login')
  res.render(path.join(__dirname + '/views/settings.ejs'))
})

app.get('/cart', function(req, res) {
  try {
    req.cookies.user || res.redirect('/login')
    var currentCart = JSON.parse(fs.readFileSync('./usercarts.json', 'utf8'))
    var currentcartusr = currentCart[req.cookies.user]

  } catch {
    var currentCart = []
  }
  res.render(path.join(__dirname + '/views/cart.ejs'), { currentCart: currentcartusr })
})

app.get('/register', function(req,res){
  if (req.cookies.user) {
    res.redirect('/storepage')
  }  
  error = req.cookies.error || ''
  console.log(error)
  res.render(path.join(__dirname +'/views/register.ejs'), {error : error})
})

app.post('/login', function(req, res) {
  const usernameTemp = req.body.username
  const passwordTemp = req.body.password

  logincheck(usernameTemp, passwordTemp, res, function(result){
    if (result) {
      console.log(usernameTemp)
      res.cookie('user', usernameTemp, {maxAge: 720000})
      res.redirect('/storepage')
    } else {
      res.redirect('/register')
    }
  }
)})

app.post('/settings', function(req, res) {
  fs.readFile('users.json', 'utf8', (err, data) => {
    const userslocal = JSON.parse(data)
    let username = req.cookies.user
    for (const user of userslocal) {
      if (user.username === username) {
        if (user.password == req.body.current_password && req.body.new_password == req.body.confirm_password) {
          user.password = req.body.new_password
        }    
        res.redirect('/storepage')
      }}
    fs.writeFile('users.json', JSON.stringify(userslocal), () => {
      console.log('Password updated')
    })
  })
})

app.post('/logout', function(req,res) {
  res.cookie('user', undefined, {maxAge:1})
  res.cookie('admin', undefined, {maxAge:1})
  res.redirect('/')
})

app.post('/addproduct', function(req,res) {
  newtitle = req.body.titlenew
  newdesc = req.body.descriptionnew
  newcost = req.body.costnew
  fs.readFile('./products.json', 'utf8', function(err, data){
    const products = JSON.parse(data)
    newid = 0
    for (let i = 0; i < products.length; i++) {
      if (products[i].id >= newid) {
        newid = products[i].id + 1
      }
    }

    const data2 = JSON.parse(data)
    data2.push({id: newid, name: newtitle, description: newdesc, price: newcost})
    fs.writeFile('./products.json', JSON.stringify(data2), function(err) {
      res.redirect('/storepage')
    })
  } )
})

app.post('/remove-item', function(req, res) {
  console.log('deleting')
  if (req.cookies.user === 'admin') {
    fs.readFile('./products.json', 'utf8', (err, data) => {
      let products = JSON.parse(data)
      let itemId = req.body['item-id']
      console.log(itemId)

      for (let i = 0; i < products.length; i++) {
        console.log(i)
        if (products[i].id == itemId) {
          console.log(i.id)
          products.splice(i, 1)
        }
      }
      fs.writeFile('./products.json', JSON.stringify(products), (err) => {
        if (err) {
          console.error(err)
        } else {
        res.redirect('/')
        }
      })
    })
  } else {
    res.redirect('/login')
  }
})

app.post('/add-to-cart', function(req, res) {
  console.log('adding')
  req.cookies.user || res.redirect('/login')
  const currentCart = req.cookies.cart || []
  const itemId = parseInt(req.body['item-id'])
  let item = items.find(i => i.id === itemId)
  if (item) {
    currentCart.push(item)
    console.log(item)
    addtocart(item, req.cookies.user)
    res.redirect('/cart')
  } else {
    res.redirect('/')
  }
})


app.post('/clear-cookies', function(req, res) {
  fs.readFile('usercarts.json', 'utf8', () => {
    NewData = '{}'
    fs.writeFileSync('usercarts.json', NewData, () => {
      console.log('Cart cleared')
    })
  })
  res.redirect('/storepage')
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
    
  console.log(users)
  savedata(users)
  res.redirect('/login')
  })
})

app.listen(3000)