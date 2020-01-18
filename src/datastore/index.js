import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'

const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

const STORE_FILE = path.join(STORE_PATH, '/data.json')
const adapter = new FileSync('./data.json') // 初始化lowdb读写的json文件名以及存储路径

const db = Datastore(adapter) // lowdb接管该文件
// console.log(STORE_FILE) // C:\Users\symant\AppData\Roaming\Electron\data.json

if (!db.has('users').value()) { // 先判断该值存不存在
  db.set('users', []).write() // 不存在就创建
}
if (!db.has('count').value()) {
  db.set('count', 0).write()
}

db.test = '#this is a test message#'

export default db // 暴露出去
