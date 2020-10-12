module.exports = function RegNumber(pool) {

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


    return {
        checkValidReg,
        filterByTown,
        addToDb,
        showAll,
        checkValid
    }
}