const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars')
const connectDB = require('./config/mongodb');
const cors = require('cors');

Handlebars.registerHelper('times', function (n, options) {
    let result = '';
    for (let i = 0; i < n; i++) {
        result += options.fn(i);
    }
    return result;
});

// Importing files
const routes = require('./routes/handlers');

const app = express();

// connect to db
connectDB();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
console.log(path.join(__dirname, '../public'));
app.use(cors());

app.engine('hbs', engine({
    extname: '.hbs'
}));

app.set('view engine', 'hbs');

app.set('views', path.join(__dirname, '/views'));


// Configure Routes
app.use('/', routes);

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
