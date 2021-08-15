const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('data.db')
const util = require('util')

db.get = util.promisify(db.get)
db.run = util.promisify(db.run)
db.all = util.promisify(db.all)

// db.get('select pre from basic', (_err, row) => {
//   console.log(row.pre)
// })
async function main() {
  let { increase } = await db.get('select increase from basic where id=1')
  increase++
  await db.run('update basic set increase=? where id=1', increase)
  console.log(increase)
}
main()
