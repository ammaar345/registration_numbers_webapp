module.exports = function RegNumber(pool) {

    // var regNumbers = initialState ? initialState : [];
    // function plateStorage() {
    //     return regNumbers;

    // }

    // function testfilter(location, registration) {
    //     // CL, CY or contains
    //     var filteredList = [];
    //     for (var i = 0; i < registration.length; i++) {
    //         const currentReg = registration[i];
    //         if (currentReg.startsWith(location)) {
    //             filteredList.push(currentReg);
    //         }
    //     }
    //     return filteredList;
    // }
    async function databaseFilter(areaCode) {
        const SELECT_QUERY = 'Select town from towns where name=$1'
        const townInitial = await pool.query(SELECT_QUERY, [areaCode])
        if (townInitial.rows.length > 0) {
            return townInitial.rows[0].town;
        }
        return 0;
    }
async function showAll(){
const SELECT_QUERY="select reg from regnumbers "
const regs=await pool.query(SELECT_QUERY)
console.log(regs.rows)
return regs.rows;
}
    // function checkExists(reg, regArray) {
    //     if (/C[YLJ] \d{3,5}$/.test(reg) || /C[YLJ] \d+-\d+$/.test(reg)) {
    //         if (!regArray.includes(reg)) {
    //             return true
    //         }
    //     }
    //     else {
    //          return false 

    //         }
    // }
    // async function addToDb(regNum) {
    //     const INSERT_QUERY = ' insert into regNumbers (reg) values ($1)';
    //     await pool.query(INSERT_QUERY, [regNum]);
    // }
    // exists in addRegNumber already
    //function checkValid(regist) {
    //     if (/C[YLJ] \d{3,5}$/.test(regist) || /C[YLJ] \d+-\d+$/.test(regist)) {
    //         return true
    //     }
    // }
    // async function addRegNumber(regNumber) {
    //     if (regNumber !== "") {
    //         if (/C[YLJ] \d{3,5}$/.test(regNumber) || /C[YLJ] \d+-\d+$/.test(regNumber)) {
    //             if (!regNumber.includes(regNumber)) {
    //                 await addToDb(regNumber)
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;

    // }

    async function addToDb(registration) {
        const regCode =await registration.substring(0, 2);
        // console.log(regCode)
        const SELECT_QUERY = 'Select id from towns where town=$1'
        const reg = await pool.query(SELECT_QUERY, [regCode])
        var regID = reg.rows[0].id;
        let SELECT_QUERY_2;
        if (regID > 0) {
            SELECT_QUERY_2 = await pool.query('SELECT * from regNumbers where reg=$1', [registration])
        }
        if (SELECT_QUERY_2.rows.length < 1) {
            var INSERT_QUERY = "insert into regNumbers (reg,regNumId) values ($1,$2)"
            await pool.query(INSERT_QUERY, [registration, regID]);

        }
    }
function filterByTown(){


}
    // async function filter(location) {
    //     // CL, CY or contains(obtained from dropdown menu)
    //     var filteredList = [];
    //     for (var i = 0; i < regNumbers.length; i++) {
    //         var currentReg = regNumbers[i]; //if no work make var = const
    //         if (town.value) {
    //             if (currentReg.startsWith(location)) {
    //                 filteredList.push(currentReg);
    //             } else if (location === "all") {

    //                 filteredList.push(currentReg);
    //             }


    //         }


    //     }

    //     return filteredList

    // }
    // function checkText(registerNum) {
    //     var msgReturned = ""
    //     if (registerNum === "") {

    //         msgReturned = "Please enter a registration number."
    //     }
    //     else if (!checkValid(registerNum)) {

    //         msgReturned = "The format of this registration number is incorrect."
    //     }

    //     else if (!checkExists(registerNum, plateStorage())) {

    //         msgReturned = "This registration number is already taken."
    //     }

    //     else if (checkExists(registerNum, plateStorage())) {

    //         msgReturned = "Entry has been successfully added."
    //     }
    //     return msgReturned
    // }
    // function classAdd(registerN) {
    //     var result = ""
    //     if (checkExists(registerN, plateStorage())) {
    //         result = "success"
    //     }
    //     else if (checkText() === "Please enter a registration number.") {
    //         result = "failed"

    //     }

    //     else if (checkText() === "The format of this registration number is incorrect.") {
    //         result = "failed"

    //     }
    //     else if (checkText() === "This registration number is already taken.") {
    //         result = "failed"

    //     }

    //     return result


    // }
    return {
        // addRegNumber,
        // plateStorage,
        // filter,

        // checkValid,
        // checkText,
        // classAdd,
        showAll,
        // databaseFilter,
        addToDb
    }
}