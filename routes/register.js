const express = require('express')
var router = express.Router()
const fs = require('fs')

const savedata = require('./functions.js').savedata;

router.get('/', function(req,res){
    if (req.cookies.user) {
      res.redirect('/storepage')
    }  
    error = req.cookies.error || ''
    console.log(error)
    res.render('register.ejs', {error : error})
  })

  
router.post('/', function(req, res) {
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
  
  module.exports = router