import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import { remote, app } from 'electron'
import pkg from '../../package.json'

const APP = process.type === 'renderer' ? remote.app : app
var STORE_PATH = APP.getAppPath()

// STORE_PATH == "C:\\****\\child_health_electron\\resources\\app.asar"
const RESOURCE_DIR = path.dirname(STORE_PATH)

if (process.env.NODE_ENV !== 'development') {
  STORE_PATH = path.join(RESOURCE_DIR, 'data.json')
  // PRO: child_health_electron\resources\data.json
} else {
  STORE_PATH = path.join(RESOURCE_DIR, '../src/datastore/data.json')
  // DEV: Child_Health_Electron\src\datastore\data.json
}

const adapter = new FileSync(STORE_PATH) // 初始化lowdb读写的json文件名以及存储路径
console.log('DataBase@ ' + STORE_PATH)

const db = Datastore(adapter) // lowdb接管该文件
db.defaults({ users: [], stored: STORE_PATH, author: pkg.author, version: pkg.version, counts: 0 })
  .write() // 一定要显式调用write方法将数据存入JSON

if (!db.has('users').value()) {
  remote.dialog().showMessageBox({
    type: 'error',
    title: 'ERROR',
    message: 'Database fatal error!',
    detail: `数据库致命错误!\n当前版本: ${pkg.version}\n联系作者: ${pkg.author}`
  })
}

db.test = '# Test message from db #'
db.STORE = STORE_PATH

export default db // 暴露出去
