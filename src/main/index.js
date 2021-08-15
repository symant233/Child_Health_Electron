/* eslint-disable no-unused-vars */
'use strict'

import { app, BrowserWindow, Menu, dialog, shell } from 'electron'
import fs from 'fs'
import path from 'path'
import pkg from '../../package.json'
import db from '../datastore/index'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow
const winURL =
  process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`
// const winURL = `file://${__dirname}/index.ejs`

function backupnow(bool) {
  var stored = db
    .read()
    .get('stored')
    .value()
  var backup = db
    .read()
    .get('backup')
    .value()
  if (!backup) {
    if (!bool) {
      // 如果没提供bool或bool为false
      backupNotFound()
    }
  } else {
    fs.copyFileSync(stored, backup)
    console.log('Run backup... @ ' + backup)
    if (!bool) {
      // 如果没提供bool或bool为false
      dialog.showMessageBox({
        type: 'none',
        title: 'Backup',
        message: 'Backup Finished',
        detail: '@' + backup
      })
    }
  }
}

function backupNotFound() {
  dialog.showMessageBox({
    type: 'info',
    // title: 'Warning',
    message: 'Setting not complete',
    detail: 'Backup folder not found.\n\n>>>Please setup backup path first.'
  })
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 593,
    useContentSize: true,
    width: 1063,
    minWidth: 343,
    title: 'Child Health Care [Electron]',
    resizable: true,
    webPreferences: {
      nodeIntegration: true // add this
    }
  })

  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  return mainWindow
}

function createMenu(mainWindow) {
  var template = [
    {
      label: '数据库',
      submenu: [
        {
          label: '数据库位置',
          submenu: [
            {
              label: '当前数据库文件夹',
              click() {
                shell.showItemInFolder(
                  db
                    .read()
                    .get('stored')
                    .value()
                )
              }
            },
            {
              label: '备份数据库文件夹',
              click() {
                var bp = db
                  .read()
                  .get('backup')
                  .value()
                if (bp) {
                  shell.showItemInFolder(bp)
                } else {
                  backupNotFound()
                }
              }
            }
          ]
        },
        {
          label: '备份选项',
          submenu: [
            {
              label: '立即备份',
              accelerator: 'Ctrl+O',
              click() {
                backupnow()
              }
            },
            { type: 'separator' },
            {
              label: '设置备份路径',
              click() {
                dialog
                  .showOpenDialog(mainWindow, {
                    properties: ['openDirectory']
                  })
                  .then(result => {
                    if (!result.canceled) {
                      var bpdir = result.filePaths[0]
                      bpdir = path.join(bpdir, 'data.json')
                      db.read()
                        .set('backup', bpdir)
                        .write()
                      console.log('Backup Dir Set @ ' + bpdir)
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            },
            {
              label: '设置备份序列',
              enabled: false,
              click() {
                dialog.showMessageBox({
                  type: 'info',
                  message: 'Coming soon...',
                  accelerator: 'Ctrl+P',
                  click() {}
                })
              }
            }
          ]
        },
        { type: 'separator' },
        { role: 'Quit', label: '退出' }
      ]
    },
    {
      role: 'editMenu',
      label: '编辑'
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '刷新' },
        // { role: 'forcereload' },
        // { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin', accelerator: 'Ctrl+=' },
        { role: 'zoomout' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        {
          label: '返回',
          accelerator: 'Alt+Left',
          click() {
            mainWindow.webContents.goBack()
          }
        },
        {
          label: '前进',
          accelerator: 'Alt+Right',
          click() {
            mainWindow.webContents.goForward()
          }
        },
        { type: 'separator' },
        { role: 'minimize', label: '最小化' },
        {
          label: '还原默认窗口大小',
          accelerator: 'Ctrl+9',
          click() {
            mainWindow.setSize(1076, 650)
            // plus titlebar and menubar
          }
        }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于',
          click() {
            dialog.showMessageBox({
              type: 'none',
              title: 'About',
              message: 'Child Health Care [Electron]',
              detail: `Version: ${pkg.version}\nAuthor: ${pkg.author}\nGithub: https://github.com/symant233`
            })
          }
        },
        {
          label: '新版本 [Link]',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal(
              'https://github.com/symant233/Child_Health_Electron/releases'
            )
          }
        },
        { type: 'separator' },
        {
          label: '打印机',
          accelerator: 'Ctrl+P',
          click() {
            mainWindow.webContents.print({ landscape: true })
          }
        },
        {
          label: '导出PDF',
          accelerator: 'Ctrl+Shift+P',
          click() {
            dialog
              .showOpenDialog(mainWindow, {
                properties: ['openDirectory']
              })
              .then(result => {
                if (!result.canceled) {
                  var printDir = result.filePaths[0]
                  var name =
                    'WebContent@' +
                    new Date().toISOString().slice(0, 10) +
                    '.pdf'
                  printDir = path.join(printDir, name)
                  // https://electronjs.org/docs/api/web-contents#contentsprinttopdfoptions
                  mainWindow.webContents
                    .printToPDF({ landscape: true })
                    .then(data => {
                      fs.writeFileSync(printDir, data, error => {
                        if (error) throw error
                        console.log('Write PDF successfully.')
                      })
                    })
                    .catch(error => {
                      console.log(error)
                    })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        },
        { type: 'separator' },
        {
          label: '开发者工具',
          accelerator: 'F12',
          click() {
            if (process.env.NODE_ENV !== 'development') {
              mainWindow.webContents.isDevToolsOpened()
                ? mainWindow.webContents.closeDevTools()
                : mainWindow.webContents.openDevTools()
            } else {
              mainWindow.webContents.openDevTools()
            }
          }
        }
      ]
    },
    { type: 'separator' }
  ]
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  mainWindow.setMenu(menu)
}

function firstTimeRun() {
  if (!db.get('backup').value()) {
    dialog.showMessageBox({
      type: 'info',
      message: '未设置备份路径',
      detail:
        '立即设置 ==> 菜单栏: 数据库->备份选项->设置备份路径\n打开后选择一个安全的文件夹, 以后退出程序会自动备份数据库.'
    })
    return true
  }
  return false
}

app.on('ready', function() {
  var win = createWindow()
  win.maximize() // 启动后最大化
  // firstTimeRun()
  createMenu(win)
})

app.on('window-all-closed', () => {
  backupnow(true)
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
