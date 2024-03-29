// sqlite3 database manager
import fs from 'fs'
import path from 'path'
import util from 'util'
import { remote, app } from 'electron'
import pkg from '../../package.json'

const APP = process.type === 'renderer' ? remote.app : app
let flag = false // 是否创建表

let STORE_PATH
var userData = APP.getPath('userData')

if (process.env.NODE_ENV !== 'development') {
  STORE_PATH = path.join(userData, 'data.db')
  // production: %APPDATA%\child_health_electron\data.db
} else {
  var dist = path.dirname(APP.getAppPath())
  STORE_PATH = path.join(dist, '../src/datastore/data.db')
  // development: Child_Health_Electron\src\datastore\data.db
}

// external database overwrite
if (fs.existsSync(path.join(userData, 'external'))) {
  const data = fs.readFileSync(path.join(userData, 'external'))
  console.log('External@ ' + data.toString())
  STORE_PATH = data.toString()
}

if (!fs.existsSync(STORE_PATH)) flag = true

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database(STORE_PATH)
console.log('DataBase@ ' + STORE_PATH)

db.run = util.promisify(db.run)
db.get = util.promisify(db.get)
db.all = util.promisify(db.all)
db.each = util.promisify(db.each)

async function initial() {
  if (flag) {
    // 首次运行创建表
    const sql = await require('./initial')
    for (let s of sql) {
      await db.run(s)
    }
    await db.run('insert into basic values (1,2,null,null,null,10000,"uid")')
  }
  const { stored } = await db.get('select stored from basic where id=1')
  if (stored !== STORE_PATH) {
    await db.run('update basic set stored=? where id=1', STORE_PATH)
  }
  const { version } = await db.get('select version from basic where id=1')
  if (version < pkg.version) {
    await db.run('update basic set version=? where id=1', pkg.version)
  }
}
initial()

class Base {
  setExternalDatabaseFile = async filePath => {
    // write file
    await fs.writeFileSync(path.join(userData, 'external'), filePath)
  }
  getUsersAll = async () => {
    return db.all('select * from users order by uid desc')
  }
  getUsersLimited = async () => {
    return db.all('select * from users order by uid desc limit 50')
  }
  getUsersPage = async page => {
    return db.all(
      'select * from users order by uid desc limit 50 offset ?',
      page * 50
    )
  }
  getUserByUid = async uid => {
    const data = await db.get('select * from users where uid=?', uid)
    return data
  }
  getUsersCount = async () => {
    const data = await db.get('select count() as count from users')
    return data.count
  }
  getUserCountByBirth = async (start, stop) => {
    const data = await db.get(
      'select count() as count from users where birth > $start and birth <= $stop',
      {
        $start: start,
        $stop: stop
      }
    )
    return data.count
  }
  deleteUser = async uid => {
    await db.run('delete from users where uid=?', uid)
    await db.run('delete from details where uid=?', uid)
    await db.run('delete from reports where uid=?', uid)
  }
  setBasicItem = async (name, value) => {
    return db.run(`update basic set ${name}=? where id=1`, value)
  }
  getBasicItem = async name => {
    const data = await db.get(`select ${name} from basic where id=1`)
    return data[name]
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
  searchUsersPage = async (name, input, page) => {
    return db.all(
      `select * from users where ${name} like $input order by uid desc limit 50 offset $offset`,
      {
        $input: input,
        $offset: page * 50
      }
    )
  }
  searchUsersCount = async (name, input) => {
    const data = await db.get(
      `select count() as count from users where ${name} like ?`,
      input
    )
    return data.count
  }
  updateUserProperty = async (uid, key, value) => {
    await db.run(`update users set ${key}=$value where uid=$uid`, {
      $uid: uid,
      $value: value
    })
  }
  updateDetailProperty = async (uid, key, value) => {
    await db.run(`update details set ${key}=$value where uid=$uid`, {
      $uid: uid,
      $value: value
    })
  }
  getDetailByUid = async uid => {
    const data = await db.get('select * from details where uid=?', uid)
    return data
  }
  initDetailByUid = async uid => {
    await db.run(
      'insert into details values (?,null,null,null,null,null,null,null,null)',
      uid
    )
  }
  getReportsByUid = async uid => {
    const data = await db.all('select * from reports where uid=?', uid)
    return data
  }
  deleteReportById = async id => {
    await db.run('delete from reports where id=?', id)
  }
  updateReportById = async obj => {
    await db.run(
      `update reports set age=$age,weight=$weight,signalW=$signalW,
      height=$height,signalH=$signalH,head=$head,signalC=$signalC,
      result=$result,time=$time where id=$id`,
      {
        $id: obj.id,
        $age: obj.age || null,
        $weight: obj.weight || null,
        $signalW: obj.signalW || null,
        $height: obj.height || null,
        $signalH: obj.signalH || null,
        $head: obj.head || null,
        $signalC: obj.signalC || null,
        $result: obj.result || null,
        $time: obj.time || null
      }
    )
  }
  insertReport = async obj => {
    await db.run(
      `insert into reports values (
        $id,$uid,$age,$weight,$signalW,$height,$signalH,$head,$signalC,$result,$time
      )`,
      {
        $id: obj.id,
        $uid: obj.uid,
        $age: obj.age || null,
        $weight: obj.weight || null,
        $signalW: obj.signalW || null,
        $height: obj.height || null,
        $signalH: obj.signalH || null,
        $head: obj.head || null,
        $signalC: obj.signalC || null,
        $result: obj.result || null,
        $time: obj.time || null
      }
    )
  }
}

export default new Base()
