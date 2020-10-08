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


app.get ("/",async function(req,res){
  // var regs=await regNumbers.showAll();
  const reg=await regNumbers.showAll();
  res.render("index",{
     reg : reg
    }) 
 })
 app.post("/reg_numbers",async function(req,res){
   var regNumber=req.body.registration;
   var town = req.body.town;
   if (regNumber=== "") 
   {    req.flash('info', 'Please enter a registration number.');
  }
else if (regNumbers.checkValid(regNumber)===0){
  
  const addReg=await regNumbers.addToDb(regNumber)

}
 else {
req.flash('info','This registration number exists already.')
 }  
 
   //const showReg=await regNumbers.showAll()
   const filter=await regNumbers.filterByTown(town);
   console.log(filter);
  //  console.log(filter)
  
//    let flash=await regNumbers.flshMsg(regNumber)
 
  // console.log(town)
   
  
  
   // regNumbers.addToDb(reg)
   
   res.render("index",{
   reg:filter
   
   })
 
 })

// app.get("/reg_numbers",async function(req,res){
 
//   res.render("index",{
 
//     })
  
// })

const PORT=process.env.PORT||3020;
app.listen(PORT,function(){
  console.log("App started at port :",PORT);
})

