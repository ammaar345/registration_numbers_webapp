const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser")
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const pg = require("pg");

const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/registration';
const pool = new Pool({
  connectionString
});

const RegNumbers = require("./regNumbers");
const RegRoute = require('./routes/regRoutes');

const regNumbers = RegNumbers(pool);
const regRoute = RegRoute(regNumbers)

app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
  layoutsDir: './views/layouts'
}));
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/', regRoute.show);
app.post('/reg_numbers',regRoute.errorMsg)
const PORT = process.env.PORT || 8713;
app.listen(PORT, function () {
  console.log("App started at port :", PORT);
})