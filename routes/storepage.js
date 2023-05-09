let express = require('express')
var router = express.Router()
let fs = require('fs')

let addtocart = require('./functions.js').addtocart;

router.get('/', function(req, res) {
  try {
    var username = req.cookies.user || res.redirect('/login')
  } catch {
    res.redirect('/')
  }
  if (req.cookies.admin) {
    username = 'admin'
  }

  fs.readFile('./products.json', 'utf8', function(err, data){
    if (err) {
      console.error(err)
      return res.sendStatus(500)
    }
    let items = JSON.parse(data)
    res.render('storefront.ejs', { items: items, username: username })
  })
});

  
router.post('/', function(req, res) {
    console.log('adding')
    req.cookies.user || res.redirect('/login')
    let currentCart = req.cookies.cart || []
    let itemId = parseInt(req.body['item-id'])
    let items =
    fs.readFile('./products.json', 'utf8', function(err, data){
      items = JSON.parse(data)
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
  })
  
router.post('/add-item', function(req,res) {
  newtitle = req.body.titlenew
  newdesc = req.body.descriptionnew
  newcost = req.body.costnew
  fs.readFile('./products.json', 'utf8', function(err, data){
    let products = JSON.parse(data)
    newid = 0
    for (let i = 0; i < products.length; i++) {
      if (products[i].id >= newid) {
        newid = products[i].id + 1
      }
    }

    let data2 = JSON.parse(data)
    data2.push({id: newid, name: newtitle, description: newdesc, price: newcost})
    fs.writeFile('./products.json', JSON.stringify(data2), function(err) {
      res.redirect('/storepage')
    })
  } )
})

router.post('/remove-item', function(req, res) {
  console.log('deleting')
  if (req.cookies.user === 'admin') {
    fs.readFile('./products.json', 'utf8', (err, data) => {
      let products = JSON.parse(data)
      let itemId = req.body['item-id']
      console.log(itemId)

      let item = products.find((product) => product.id == itemId)

      if (item) {
        products.splice(products.indexOf(item), 1)
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

router.post('/logout', function(req,res) {
  res.cookie('user', undefined, {maxAge:1})
  res.cookie('admin', undefined, {maxAge:1})
  res.redirect('/')
})

  module.exports = router