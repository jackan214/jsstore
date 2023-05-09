let express = require('express')
var router = express.Router()
let fs = require('fs')

router.get('/', function(req, res) {
    req.cookies.user || res.redirect('/login')
    res.render('settings.ejs')
  })

router.post('/', function(req, res) {
  fs.readFile('users.json', 'utf8', (err, data) => {
    let userslocal = JSON.parse(data)
    let username = req.cookies.user
    for (let user of userslocal) {
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

module.exports = router