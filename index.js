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
  // var regs=await regNumbers.showAll();
  const reg = await regNumbers.showAll();
  res.render("index", {
    reg: reg
  })
})
app.post("/reg_numbers", async function (req, res) {
  var regNumber = req.body.registration;
  var town = req.body.town;
  //   if (regNumber === "") {
  //     req.flash("info", "Please enter a registration number.")
  //   }
  //   else
  //     if (regNumber !== "") {//1
  //       // if (regNumbers.checkValid(regNumber) === 0){
  //        //2
  //          if (regNumbers.checkValidReg(regNumber)===true)   {//3
  //           if(regNumbers.checkValid(regNumber)===0){
  //           const addReg = await regNumbers.addToDb(regNumber)
  //           req.flash('info', 'Registration successfully added.')
  //          if(regNumbers.checkValidReg(regNumber)===false){
  // req.flash('info','Invalid registration number.'
  // )
  //         }
  //         }
  //         }//3
  //       // }

  //       //  }//2
  //       else 
  //       if (regNumbers.checkValid(regNumber) > 0) 
  //       {
  //         req.flash('info', 'Registration already exists.')
  //       }
  //     }//1

  //   {

  //   }
  // else {
  //       req.flash('info', 'Please enter a registration number.');
  //     }
  //   }
  //   else {
  //    ) {

  //       
  //       req.flash('info', 'Your registration has been added.')

  //     }
  //     else {

  //       req.flash('info', 'Invalid Registration.')
  //       return false
  //     }


  //   }
  //const showReg=await regNumbers.showAll()
  const valid = await regNumbers.checkValid(regNumber);
  const chkFormat = await regNumbers.checkValidReg(regNumber)
  if (regNumber === "") {
    req.flash('invalid', 'Please enter a registration number.');
  }
  else if (valid === 0) {
    console.log('else if ');
    if (chkFormat) {
      console.log('else if  IF');
      const addReg = await regNumbers.addToDb(regNumber)
      console.log({ addReg });
      req.flash('success', 'Registration successfully added.')
    }

    else {
      req.flash('invalid', 'Invalid registration number.')

    }
    
  }
  else if (valid !== 0) {
      console.log("bread")
      req.flash('dup', 'Registration already exists.')
    }
  // else {
  //   req.flash('info', 'This registration number exists already.')
  // }
  const filter = await regNumbers.filterByTown(town);
  console.log({ filter });
  //  console.log(filter)

  //    let flash=await regNumbers.flshMsg(regNumber)

  // console.log(town)



  // regNumbers.addToDb(reg)

  res.render("index", {
    reg: filter

  })

})

// app.get("/reg_numbers",async function(req,res){

//   res.render("index",{

//     })

// })

const PORT = process.env.PORT || 8713;
app.listen(PORT, function () {
  console.log("App started at port :", PORT);
})

