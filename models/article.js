const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const {JSDOM} = require('jsdom'); //just the portion JSDOM is needed
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now //or () => Date.now()
    },
    slug: { //used to identify an article from another (used also in the url)
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function(next) { //run this function before an article is saved, edited, deleted
    //create slug from title
    if(this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true});
    }

    if(this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown)); //marked.parse(this.markdown): convert markdonw to html, dompurify.sanitize: get rid of any malicious code
    }

    next();
})

module.exports = mongoose.model('Article', articleSchema); //Article: name of the model. A table in db called Article