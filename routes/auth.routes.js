const express = require('express');
const router = express.Router();
const User = require('../models/User.model')
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res, next) =>{
    res.render('user/signup')
})

router.post("/signup", (req, res, next) =>{
    const {firstName, lastName, email, username, password} = req.body;
    if(!firstName || !lastName || !email || !username || !password){
        res.redirect('/signup')
    }else{
       User.findOne({username}).then(user =>{
            if(!user){
            const hashedPassword = bcrypt.hashSync(password, 10)
             User.create({
                firstName,
                lastName,
                email,
                username,
                password: hashedPassword
                
            }).then(createdUser =>{
                 console.log({user : createdUser})
            res.render('user/dashboard', {user : createdUser});
            })
           
        }
       })
       
    }
})

router.get('/login', (req, res, next) =>{
    res.render('user/login')
})

router.post('/login', (req, res, next) =>{
    const {username, password} = req.body;
    if(!username || !password){
        res.render('/login', {
            errorMessage: "Please enter both username and password"
        });
    }else{
        User.findOne({username}).then((userFromDB)=>{
            if(!userFromDB){
                res.status(500).render("user/signup",{
                    errorMessage: "We could not find you! Would you like to create an account?"
                })
            }else if(bcrypt.compareSync(password, userFromDB.password)){
                //req.session.user = userFromDB
                res.status(200).render('user/dashboard', {user: userFromDB});
            }else{
                res.status(500).render('user/login', {errorMessage: "Incorrect Log In data"})
            }
        })
    }
})

// router.get('/profile', (req, res, next) => {
//     res.render('user/profile', {user: userFromDB})
// })




module.exports = router;
