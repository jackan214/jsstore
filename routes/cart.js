let express = require('express')
var router = express.Router()
let fs = require('fs')


router.get('/', function(req, res) {
  req.cookies.user || res.redirect('/login')
  try {
    var currentCart = JSON.parse(fs.readFileSync('./usercarts.json', 'utf8'))
    var currentcartusr = currentCart[req.cookies.user]
  } catch {
    var currentCart = []
  }
  res.render('cart.ejs', { currentCart: currentcartusr });
})

router.post('/', function(req, res) {
  fs.readFile('usercarts.json', 'utf8', () => {
    NewData = '{}'
    fs.writeFileSync('usercarts.json', NewData, () => {
      console.log('Cart cleared')
    })
  })
  res.redirect('/storepage')
})
  
module.exports = router