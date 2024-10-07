const express = require('express');
const mongoose = require('mongoose');
const path = require('node:path');
const methodOverride = require('method-override');

const app = express();

const url = 'mongodb://localhost:27017/markdown-blog'; //markdown-blog: db name

mongoose.connect(
    "mongodb://localhost:27017/markdown-blog",
    {
        "authSource": "admin",
        "user": "simon",
        "pass": "1234"
    }
  );


const articleRouter = require('./routes/articles');

const Article = require('./models/article');

app.set('view engine', 'ejs');

app.use('/css', express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use('/js', express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

app.use(express.urlencoded({extended: false})); //to access all the params from the article form inside the article route by accessing req.body. ...

app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const articles = await Article.find().sort({creationDate: 'desc'}); //get all articles in the db
    res.render('articles/index', {articles: articles});
})

app.use('/articles', articleRouter);

app.listen(5000);