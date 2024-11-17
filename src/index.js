const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars')
const connectDB = require('./config/mongodb');
const cors = require('cors');

const handlebarsHelper = require('./helpers/handlebarsHelper')

Handlebars.registerHelper('times', function (n, options) {
    let result = '';
    for (let i = 0; i < n; i++) {
        result += options.fn(i);
    }
    return result;
});

Object.entries(handlebarsHelper).forEach(([name, fn]) => {
    Handlebars.registerHelper(name, fn);
});

// Importing files
const routes = require('./routes/handlers');

const app = express();

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.use(cors());

app.engine('hbs', engine({
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, '/views'));


// Configure Routes
app.use('/', routes);

const port = process.env.PORT || 3000

// connect to db
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });
}).catch(() => {
    console.log("Connection failed!");
})


