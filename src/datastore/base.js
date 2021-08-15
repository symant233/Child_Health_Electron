// sqlite3 database manager
import fs from 'fs'
import path from 'path'
import util from 'util'
import { remote, app } from 'electron'
import pkg from '../../package.json'

const APP = process.type === 'renderer' ? remote.app : app

let STORE_PATH
if (process.env.NODE_ENV !== 'development') {
  var userData = APP.getPath('userData')
  STORE_PATH = path.join(userData, 'data.db')
  // production: %APPDATA%\child_health_electron\data.db
} else {
  var dist = path.dirname(APP.getAppPath())
  STORE_PATH = path.join(dist, '../src/datastore/data.db')
  // development: Child_Health_Electron\src\datastore\data.db
}

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(STORE_PATH)
console.log('DataBase@ ' + STORE_PATH)

if (!fs.existsSync(STORE_PATH)) {
  // first time run initializing
  const sql = require('./initial')
  sql.forEach(s => {
    db.run(s, function(err) {
      if (err) console.log(err.message)
    })
  })
  db.get('select stored from basic', (_err, row) => {
    if (row.stored !== STORE_PATH) {
      db.run('update basic set stored=? where id=1', STORE_PATH)
    }
  })
}

db.get('select version from basic', (_err, row) => {
  if (row.version < pkg.version) {
    db.run('update basic set version=? where id=1', pkg.version)
  }
})

db.run = util.promisify(db.run)
db.get = util.promisify(db.get)
db.all = util.promisify(db.all)
db.each = util.promisify(db.each)

class Base {
  constructor() {
    this.db = db
  }
  getUsersAll = async () => {
    return db.all('select * from users order by uid desc')
  }
  getUsersLimited = async () => {
    return db.all('select * from users order by uid desc limit 50')
  }
  getUserByUid = async uid => {
    const data = await db.get('select * from users where uid=?', uid)
    return data
  }
  getUsersCount = async () => {
    const data = await db.get('select count() as count from users')
    return data.count
  }
  deleteUser = async uid => {
    await db.run('delete from users where uid=?', uid)
    await db.run('delete from details where uid=?', uid)
    await db.run('delete from reports where uid=?', uid)
  }
  setBasicSearch = async searchName => {
    return db.run('update basic set search=? where id=1', searchName)
  }
  getBasicSearch = async () => {
    const data = await db.get('select search from basic where id=1')
    return data.search
  }
  checkUsersExists = async (baby, birth) => {
    const user = await db.get(
      'select * from users where baby=$baby and birth=$birth',
      {
        $baby: baby,
        $birth: birth
      }
    )
    if (user) return true
    return false
  }
  useBasicIncrease = async () => {
    let { increase } = await db.get('select increase from basic where id=1')
    increase++
    await db.run('update basic set increase=? where id=1', increase)
    return increase
  }
  insertUser = async obj => {
    await db.run(
      `insert into users values (
        $uid,$name,$baby,$male,$birth,$fixed,$tele,$note,$danger,$level,$weight,$week,$G,$P
      )`,
      {
        $uid: obj.uid,
        $name: obj.name || null,
        $baby: obj.baby || null,
        $male: obj.male || null,
        $birth: obj.birth || null,
        $fixed: obj.fixed || null,
        $tele: obj.tele || null,
        $note: obj.note || null,
        $danger: obj.danger || false,
        $level: obj.level || null,
        $weight: obj.weight || null,
        $week: obj.week || null,
        $G: obj.G || null,
        $P: obj.P || null
      }
    )
  }
  updateUser = async obj => {
    await db.run(
      `update users set name=$name,baby=$baby,male=$male,
      birth=$birth,fixed=$fixed,tele=$tele,note=$note,
      danger=$danger,level=$level where uid=$uid`,
      {
        $uid: obj.uid,
        $name: obj.name || null,
        $baby: obj.baby || null,
        $male: obj.male || null,
        $birth: obj.birth || null,
        $fixed: obj.fixed || null,
        $tele: obj.tele || null,
        $note: obj.note || null,
        $danger: obj.danger || false,
        $level: obj.level || null
      }
    )
  }
  searchUsers = async (name, input) => {
    return db.all(
      `select * from users where ${name} like ? order by uid desc`,
      input
    )
  }
}

export default new Base()
