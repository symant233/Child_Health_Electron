import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import { remote, app } from 'electron'
import pkg from '../../package.json'

const APP = process.type === 'renderer' ? remote.app : app

let STORE_PATH
if (process.env.NODE_ENV !== 'development') {
  var userData = APP.getPath('userData')
  STORE_PATH = path.join(userData, 'data.json')
  // production: %APPDATA%\child_health_electron\data.json
} else {
  var dist = path.dirname(APP.getAppPath())
  STORE_PATH = path.join(dist, '../src/datastore/data.json')
  // development: Child_Health_Electron\src\datastore\data.json
}

const adapter = new FileSync(STORE_PATH) // 初始化lowdb读写的json文件名以及存储路径
const db = Datastore(adapter) // lowdb接管该文件
console.log('DataBase@ ' + STORE_PATH)

db.defaults({
  users: [],
  details: [],
  pre: 2,
  stored: STORE_PATH,
  backup: '',
  author: pkg.author,
  version: pkg.version,
  increase: 10000,
  language: 'Chinese',
  search: 'baby'
}).write() // 一定要显式调用write方法将数据存入JSON
// count: db.get('users').size().value()

if (db.get('stored').value() !== STORE_PATH) {
  db.set('stored', STORE_PATH).write()
} // 如果数据迁移

if (!db.has('users').value()) {
  remote.dialog().showMessageBox({
    type: 'error',
    title: 'ERROR',
    message: 'Database fatal error!',
    detail: `数据库致命错误!\n当前版本: ${pkg.version}\n联系作者: ${pkg.author}`
  })
}
if (pkg.version > db.get('version').value()) {
  db.set('version', pkg.version).write()
} // 更新数据库里的版本号

export default db // 暴露出去
