var express = require('express')
var bodyParser = require('body-parser')
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

var count = 0;
app.post('/users/create',(req, res)=>{
    db.get('users').push({id:count + 1 , name: req.body.todo}).write();
    // data.push({id:data.length + 1 , name: req.body.todo}).write();
    count++;
    res.redirect('/users');
});



app.listen(port, function () {
    console.log('Server listening');
})

