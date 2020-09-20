var express = require('express')
var bodyParser = require('body-parser')
const shortid = require('shortid');
const pug = require('pug')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
var db = low(adapter)

var app = express()
var port = 3000

// Set some defaults
db.defaults({ users: []})
    .write()

app.set('view engine', 'pug')
app.set('views', './views')


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.get('/', function (req, res) {
   res.render('home', {
       name: 'pug'
   });
});

app.get('/users', (req, res)=>{
    res.render('users/index', {
        users: db.get('users').value()
    })
});

app.get('/users/search', (req, res)=>{
    var q = req.query.q;
    var matchUsers = users.filter((user)=>{
       return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
    });

    //render list user match
    res.render('users/index', {
        users: matchUsers
    });
});

app.get('/users/create',(req, res)=>{
   res.render('users/create');
});

//get user with parameter
app.get('/users/:id',(req, res)=>{
    var userId = req.params.id;
    var user = db.get('users').find({id:userId}).value();
    //return view
    res.render('users/view',{user: user});
});

app.get('/users/:id/delete', (req, res)=>{
   var userId = req.params.id;
   var user = db.get("users").find({ id:userId}).value();
   console.log(user);
   db.get('users')
        .remove({ id: user.id })
        .write()
   res.redirect('/users');
});

app.post('/users/create',(req, res)=>{
    db.get('users').push({id:shortid.generate() , name: req.body.todo}).write();
    res.redirect('/users');
});



app.listen(port, function () {
    console.log('Server listening');
})

