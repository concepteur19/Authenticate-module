require('dotenv').config();
const express = require ('express');
const bodyParser = require ('body-parser');
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');


const app = express();

app.set('view engine', 'ejs'); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//const secret = process.env.SECRET;


//add encryption package to the user schema, define the secret use to encrypt and also the field we actually want to encrypt 
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);

app.get('/', function(req, res){
    res.render('home')
});

app.get('/login', function(req, res){
    res.render('login')
});

app.post('/login', function (req, res) {
    const email = req.body.username;
    const passWord = req.body.password;

    User.findOne({email: email}, function(err, foundUser){
        if(foundUser){
            if(passWord === foundUser.password) {
                res.render('secrets')
            }
        } else{
            console.log(err);
        }
    })
    //res.send(`Nice ${email} you have been registered, you would be redirected in few second`);
})


app.get('/register', function(req, res){
    res.render('register')
});

app.post('/register', function (req, res) {
    const email = req.body.username;
    const passWord = req.body.password;

    const user = new User({
        email: email,
        password: passWord
    })
    user.save(function(err) {
        if(!err){
            res.render('secrets')
        } else{
            console.log(err);
        }
    });
    //res.send(`Nice ${email} you have been registered, you would be redirected in few second`);
    
})



app.listen(3000, function() {
    console.log("server started on port 3000")
})