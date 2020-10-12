const assert = require("assert");
const RegNum = require("../regNumbers");

const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/registration';
const pool = new Pool({
    connectionString
});
beforeEach(async function () {
    await pool.query("delete from regnumbers");
    // await pool.query("delete from towns");
})
describe("Should test that the registrations are being inserted into the database.", function () {
    it("Should show  3 registrations in the database.", async function () {
        let regNum = RegNum(pool)
        await regNum.addToDb("CA 9001");
        await regNum.addToDb("CJ 1092");
        await regNum.addToDb("CY 0120");
        var allPlates = await regNum.showAll()
        assert.deepEqual(allPlates, [
            { reg: 'CA 9001' },
            { reg: 'CJ 1092' },
            { reg: 'CY 0120' }
        ])
    })
    it("Should return  2 registrations in the database.", async function () {
        let regNum = RegNum(pool)
        await regNum.addToDb("CA 5511");
        await regNum.addToDb("CJ 2010")
        var allPlates = await regNum.showAll()
        assert.deepEqual(allPlates, [
            { reg: 'CA 5511' },
            { reg: 'CJ 2010' }
        ])
    })
    it("Should show  3 registrations in the database , since one registration is a duplicate.", async function () {
        let regNum = RegNum(pool)
        await regNum.addToDb("CY 1021");
        await regNum.addToDb("CJ 9512");
        await regNum.addToDb("CA 0220")
        await regNum.addToDb("CA 0220")
        var allPlates = await regNum.showAll()
        assert.deepEqual(allPlates, [
            { reg: 'CY 1021' },
            { reg: 'CJ 9512' },
            { reg: 'CA 0220' }
        ])
    })

})



describe('Should test the filter by town function.', async function () {


    it("Should return 2 registrations in the database , since the value 1 is inserted , as matching the database foreign key.", async function () {
        let regNum = RegNum(pool)
        await regNum.addToDb("CY 8812");
        await regNum.addToDb("CJ 9031");
        await regNum.addToDb("CA 0220")
        await regNum.addToDb("CA 0190")
        var filtered = await regNum.filterByTown("1")
        assert.deepEqual(filtered, [
            { reg: 'CA 0220' },
            { reg: 'CA 0190' }
        ])
    })

    it("Should return  1 registration from Paarl , since the value 3 is inserted , as matching the database foreign key.", async function () {
        let regNum = RegNum(pool)
        await regNum.addToDb("CY 7991");
        await regNum.addToDb("CJ 9012");
        await regNum.addToDb("CA 9891")
        await regNum.addToDb("CA 9902")
        var filtered = await regNum.filterByTown("3")
        assert.deepEqual(filtered, [
            { reg: 'CY 7991' },

        ])
    })
    it("Should return one registration from bellville since the value 2 is inserted as matching the database foreign key.", async function () {
        let regNum = RegNum(pool)
        await regNum.addToDb("CY 1021");
        await regNum.addToDb("CJ 9512");
        await regNum.addToDb("CA 0220")
        await regNum.addToDb("CA 0190")
        var filtered = await regNum.filterByTown("2")
        assert.deepEqual(filtered, [
            { reg: 'CJ 9512' },

        ])
    })

    it("Should return  all the registrations in the database since the all value is inserted.", async function () {
        let regNum = RegNum(pool)
        await regNum.addToDb("CY 10921");
        await regNum.addToDb("CJ 5441");
        await regNum.addToDb("CA 7861")
        await regNum.addToDb("CA 7612")
        var filtered = await regNum.filterByTown("all")
        assert.deepEqual(filtered, [
            { reg: 'CY 10921' },
            { reg: 'CJ 5441' },
            { reg: 'CA 7861' },
            { reg: 'CA 7612' }



        ])
    })


})




describe('Should test if the number plate is valid.', async function () {


    it("Should return false for the entered value.", async function () {
        let regNum = RegNum()
        var reg = 'C Y 932'
        assert.equal(regNum.checkValidReg(reg), false)
    })

    it("Should return false , since the registration is invalid.", async function () {
        let regNum = RegNum()
        var reg = 'kjaf'
        assert.equal(regNum.checkValidReg(reg), false)
    })
    it("Should return true , since the registration format is correct.", async function () {
        let regNum = RegNum()
        var reg = 'CJ 02-21'
        assert.equal(regNum.checkValidReg(reg), true)
    })

    it("Should return true , since the registration format is correct.", async function () {
        let regNum = RegNum()
        var reg = 'CY 9021'
        assert.equal(regNum.checkValidReg(reg), true)
    })


})
