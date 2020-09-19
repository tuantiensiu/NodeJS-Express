var express = require('express')
var bodyParser = require('body-parser')
const pug = require('pug')

var app = express()
var port = 3000

var users = [
    {id: 1, name: 'Tien'},
    {id: 2, name: 'Trung'},
    {id: 3, name: 'Phat'},
];

app.set('view engine', 'pug')
app.set('views', './views')


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.get('/', function (req, res) {
   res.render('home', {
       name: 'pug'
   });
});
// app.get('/user', function (req, res) {
//     res.render('users/index', {users: [
//             {id: 1, name: 'Tien'},
//             {id: 2, name: 'Nga'},
//             {id: 3, name: 'Giap'},
//         ]});
// });

app.get('/users', (req, res)=>{
    res.render('users/index', {
        users: users
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

app.post('/users/create',(req, res)=>{
    users.push({name: req.body.todo});
    console.log(req.body.todo);
    res.redirect('/users');
});



app.listen(port, function () {
    console.log('Server listening');
})

