module.exports = function route(regNumbers) {
  // async function show(req, res, next) {
  // 	try {
  // res.redirect("/reg_numbers");
  // 		}

  // 	catch (err) {
  // 		next(err);
  // 	}
  // };
  async function show(req, res, next) {
    const reg = await regNumbers.showAll();
    res.render("index", {
      reg: reg
    })
  }   // app.get("/reg_numbers", async function (req, res) {
  //   const reg = await regNumbers.showAll();
  //   res.render("index", {
  //     reg: reg
  //   })
  // })
  
   async function errorMsg (req, res ,next) {
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

  }
   
  
  return { show ,errorMsg}
}
