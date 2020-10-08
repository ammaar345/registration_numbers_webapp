const assert = require("assert");
const RegNum = require("../regNumbers");

const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://sneakygoblin:codex123@localhost:5432/registration';
const pool = new Pool({
    connectionString
});
beforeEach(async function () {
    await pool.query("delete from regnumbers");
    // await pool.query("delete from towns");
})
describe("Should return all the registrations in the database are being displayed", function () {
    it("Should show  3 registrations in the database.", async function () {
        let regNum = RegNum(pool)
        await regNum.addToDb("CA 9001");
        await regNum.addToDb("CJ 1092");
        await regNum.addToDb("CY 0120")
        assert.deepEqual(await regNum.showAll(), [
            { reg: 'CA 9001' },
            { reg: 'CJ 1092' },
            { reg: 'CY 0120' }
        ])
    })
    it("Should return  2 registrations in the database.", async function () {
        let regNum = RegNum(pool)
        await regNum.addToDb("CA 5511");
        await regNum.addToDb("CJ 2010")
        assert.deepEqual(await regNum.showAll(), [
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
        assert.deepEqual(await regNum.showAll(), [
            { reg: 'CY 1021' },
            { reg: 'CJ 9512' },
            { reg: 'CA 0220' }
        ])
    })
})
describe ('Testing the filter by town function',function(){



})
