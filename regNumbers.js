module.exports = function RegNumber(pool) {
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

    // exists in addRegNumber already

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
    // async function databaseFilter(areaCode) {
    //     const SELECT_QUERY = 'Select town from towns where name=$1'
    //     const townInitial = await pool.query(SELECT_QUERY, [areaCode])
    //     if (townInitial.rows.length > 0) {
    //         return townInitial.rows[0].town;
    //     }
    //     return 0;
    // }
     function checkValidReg(regist) {
        return (/C[YAJ] \d{3,5}$/.test(regist) || /C[YAJ] \d+-\d+$/.test(regist))
    }
    async function checkValid(regNumber) {
        const checkDuplicate = await pool.query("SELECT reg from regnumbers where reg=$1", [regNumber])
        return checkDuplicate.rowCount;
    }

    async function addToDb(registration) {
        if (registration !== "") {
            // checkValidReg(registration)
            const regCode = await registration.substring(0, 2);
            // console.log(regCode)
            const SELECT_QUERY = 'Select id from towns where town=$1'
            const reg = await pool.query(SELECT_QUERY, [regCode])
            var regID = reg.rows[0].id;
            //console.log(regID)
            let SELECT_QUERY_2;
            if (regID > 0) {
                SELECT_QUERY_2 = await pool.query('SELECT * from regNumbers where reg=$1', [registration])
            }
            if (SELECT_QUERY_2.rows.length < 1) {
                var INSERT_QUERY = 'insert into regNumbers (reg,regNumId) values ($1,$2)'
                await pool.query(INSERT_QUERY, [registration, regID]);

            }
        }
    }
    async function showAll() {
        const SELECT_QUERY = 'select reg from regNumbers '
        const reg = await pool.query(SELECT_QUERY)
        return reg.rows;
    }
    async function filterByTown(town) {
        let SELECT_QUERY;
        let townVal;
        if (town === "all") {
            SELECT_QUERY = 'SELECT reg FROM regnumbers';
            townVal = await pool.query(SELECT_QUERY)
            return townVal.rows
        }
        else {
            SELECT_QUERY = ('Select reg from regNumbers where regnumid=$1')
            townVal = await pool.query(SELECT_QUERY, [town])
            return townVal.rows;
        }


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
        // databaseFilter,
        // flshMsg,
        checkValidReg,
        filterByTown,
        addToDb,
        showAll,
        checkValid
    }
}