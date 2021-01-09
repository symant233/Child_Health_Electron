const Datastore = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const path = require('path')

const adapter = new FileSync('./data.json')
const db = Datastore(adapter)

// db.defaults({
//   users: [],
//   stored: STORE_PATH,
//   backup: '',
//   author: pkg.author,
//   version: pkg.version,
//   increase: 0
// }).write() // 一定要显式调用write方法将数据存入JSON

// count: db.get('users').size().value()

var change = {
  uid: 10007,
  name: 'border',
  baby: 'radius',
  birth: '2020-01-19',
  fixed: '',
  tele: '123',
  note: 'changed',
  danger: false
}
// var test = db.get('users').find().assign(change).write()

var test = db
  .get('users')
  .find({ uid: 10002 })
  .value()

console.log(test)
