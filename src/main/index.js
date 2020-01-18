/* eslint-disable no-unused-vars */
'use strict'

import { app, BrowserWindow, Menu, dialog } from 'electron'
import pkg from '../../package.json'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`
// const winURL = `file://${__dirname}/index.ejs`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    title: 'Child Health Care [Electron]',
    resizable: false,
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

function createMenu (mainWindow) {
  // if (process.env.NODE_ENV !== 'development') {
  const template = [
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        {
          label: 'Backup',
          accelerator: 'Ctrl+O',
          click () {}
        },
        {
          label: 'Settings',
          accelerator: 'Ctrl+P',
          click () {}
        },
        { type: 'separator' },
        { role: 'Quit' }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'About',
          click () {
            dialog.showMessageBox({
              type: 'none',
              title: 'About',
              message: 'Child Health Care [Electron]',
              detail: `Version: ${pkg.version}\nAuthor: ${pkg.author}\nGithub: https://github.com/symant233`
            })
          }
        },
        {
          label: 'Releses',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://github.com/symant233/Child_Health_Electron/releases')
          }
        },
        { type: 'separator' },
        {
          label: 'DevTools',
          accelerator: 'F12',
          click () {
            if (process.env.NODE_ENV !== 'development') {
              mainWindow.webContents.isDevToolsOpened()
                ? mainWindow.webContents.closeDevTools()
                : mainWindow.webContents.openDevTools()
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

app.on('ready', function () {
  var win = createWindow()
  mainWindow.webContents.closeDevTools()
  createMenu(win)
})

app.on('window-all-closed', () => {
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
