let express = require("express");
var router = express.Router();

router.get("/",function(req,res){
    if (req.cookies.user) {
      res.redirect('/storepage')
    }

    res.render("htmlfile")
  });
module.exports = router;
