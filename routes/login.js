let express = require('express');
var router = express.Router();

let logincheck = require('./functions.js').logincheck;

router.get("/",function(req,res){
    if (req.cookies.user) {
      res.redirect('/storepage')
    }  
    res.render('login.ejs')
  })

router.post('/', function(req, res) {
    let usernameTemp = req.body.username
    let passwordTemp = req.body.password
  
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
  

module.exports = router