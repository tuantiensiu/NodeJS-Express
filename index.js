var express = require('express')
var bodyParser = require('body-parser')
const shortid = require('shortid');
const pug = require('pug')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const adapterBooks = new FileSync('book.json')
var db = low(adapter)
var dbBook = low(adapterBooks)

var app = express()
var port = 3000

// Set some defaults
db.defaults({ users: []})
    .write()

//setup view render pug
app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


app.get('/books', (req, res)=>{
    res.render("books/book",{books: dbBook.get("books").value()})
});

//Create data base
app.post('/books/create', (req, res)=>{
   dbBook.get('books').push({
           id: shortid.generate(),
           title: req.body.title,
           description: req.body.description
       }).write();
   res.redirect('/books');
});

//update books
app.get('/books/update/:id', (req, res)=>{
   var bookId = req.params.id;
   var book = dbBook.get('books').find({ id:bookId}).value();
   res.render('books/update', { book: book});
});

app.post('/books/update', (req, res)=>{
    var bookId = req.body.id;
    dbBook.get("books").find({
        id: bookId
    }).assign({
        title: req.body.title
    }).write();

    res.redirect("/books");
});

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

