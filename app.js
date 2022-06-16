require('dotenv').config();
const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const saltRound = 10;
//const md5 = require('md5')
//const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs'); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model('User', userSchema);

app.get('/', function(req, res){
    res.render('home')
});

app.get('/login', function(req, res){
    res.render('login')
});

app.post('/login', function (req, res) {

    //const email = req.body.username;
    //const password = req.body.password;

    User.findOne({email: req.body.username}, function(err, foundUser){
        
        if(err){
            console.log(err);
        } else{
            if(foundUser){
                bcrypt.compare(req.body.password, foundUser.password, function(error, result) {
                    if(result === true) {
                        res.render('secrets')
                    } else{
                        console.log(error);
                    }
                });    
            }
        }
        
    })
});


app.get('/register', function(req, res){
    res.render('register')
});

app.post('/register', function (req, res) {
    //const passWord = req.body.password;
    bcrypt.hash(req.body.password, saltRound, function(err, hash){
        const user = new User({
            email: req.body.username,
            password: hash
        })

        user.save(function(err) {
            if(!err){
                res.render('secrets')
            } else{
                console.log(err);
            }
        });
    })

    //res.send(`Nice ${email} you have been registered, you would be redirected in few second`);
    
});



app.listen(3000, function() {
    console.log("server started on port 3000")
});