const express = require("express");
const fs = require("fs")

let items
fs.readFile('./products.json', 'utf8', function(err, data){
  items = JSON.parse(data)
})

function logincheck(username, password, res, callback) {

  fs.readFile('users.json', 'utf8', (err, data) => {
    const userslocal = JSON.parse(data)

    let found = false
    for (const user of userslocal) {
      console.log(username,password,user.username,user.password)
      if (user.username === username && user.password === password) {
        found = true
        if (user.type === 'admin') {
          res.cookie('admin', 'admin', {maxAge: 720000})
        }
  
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

module.exports = {
    addtocart,
    savedata,
    logincheck
  }