/**
 * 程序入口
 */

// Modules to control application life and create native browser window
const {app, BrowserWindow, shell, ipcMain, screen, Tray, Menu } = require('electron')
const path = require('path')

const iconPt = './assets/icon.ico'

let primaryScreen, mainWindow, popWindow

function createMainWindow () {
    // Create the browser window.
    primaryScreen = screen.getPrimaryDisplay()
    mainWindow = new BrowserWindow({
        width: primaryScreen.size.width * 0.75,
        height: primaryScreen.size.height * 0.75,
        center: true,
        frame: true,
        show: false,
        transparent: false,
        resizable: true,
        title: '猫猫回收站',
        icon: iconPt,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            webSecurity: false
        }
    })
    mainWindow.setMenu(null)
    // and load the index.html of the app.
    mainWindow.loadFile('index.html')
        .then(() => console.log('Start Successfully.'))
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    // Open the DevTools.
    // mainWindow.webContents.openDevTools({mode: "detach"})
}

function createPopWindow() {
    popWindow = new BrowserWindow({
        width: 60,
        height: 90,
        frame: false,
        show: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: false,
        skipTaskbar: true,
        // parent: mainWindow,
        title: '猫猫回收站',
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            webSecurity: false
        }
    })
    popWindow.setPosition(40, primaryScreen.size.height - 120, true)
    popWindow.loadFile('./views/desktop-pet.html')
        .then(() => {console.log('load pop window')})
    popWindow.setMenu(null)
    popWindow.show()
}

function ipcRegistry() {
    // 创建 main 线程中移动删除到回收站函数
    function delToRecycleBinFolder(ev, path) {
        shell.trashItem(path).then(r => console.log(r))
    }
    // 打开桌面窗口
    function openPopWindow() {
        if (popWindow == null) createPopWindow()
    }
    // registry
    ipcMain.on('del-to-recycle', delToRecycleBinFolder)
    ipcMain.on('open-pop-window', openPopWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // createMainWindow()
    ipcRegistry()
    // create tray
    const tray = new Tray(iconPt)
    const contextMenu = Menu.buildFromTemplate([
        {
            label: '关闭程序',
            click: ()=>{app.quit()}
        },
    ])
    tray.setToolTip('单击打开设置面板')
    tray.setContextMenu(contextMenu)
    tray.listeners('')
    tray.on('click', ()=>{
        console.log('click')
        if (mainWindow == null || mainWindow.isDestroyed()) {
            createMainWindow();
        } else mainWindow.show();
    })

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on('window-all-closed', function () {
    // if (process.platform !== 'darwin') app.quit()
// })

