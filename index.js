const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser")
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const pg = require("pg");

const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://sneakygoblin:codex123@localhost:5432/registration';
const pool = new Pool({
  connectionString
});

const RegNumbers = require("./regNumbers");
const regNumbers = RegNumbers(pool);

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

app.get('/', (req, res) => res.redirect('/reg_numbers'))

app.get("/reg_numbers", async function (req, res) {
  const reg = await regNumbers.showAll();
  res.render("index", {
    reg: reg
  })
})
app.post("/reg_numbers", async function (req, res) {
  var regNumber = req.body.registration;
  var town = req.body.town;
  const valid = await regNumbers.checkValid(regNumber);
  const chkFormat = await regNumbers.checkValidReg(regNumber)
  if (regNumber === "") {
    req.flash('invalid', 'Please enter a registration number.');
  }
  else if (valid === 0) {
    if (chkFormat) {

      const addReg = await regNumbers.addToDb(regNumber)
      req.flash('success', 'Registration successfully added.')
    }

    else {
      req.flash('invalid', 'Invalid registration number.')

    }
  }
  else if (valid !== 0) {
    req.flash('dup', 'This Registration number already exists.')
  }
  const filter = await regNumbers.filterByTown(town);
  res.render("index", {
    reg: filter

  })

})
const PORT = process.env.PORT || 8713;
app.listen(PORT, function () {
  console.log("App started at port :", PORT);
})

