const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require("path");
const { spawn } = require("child_process");

let expressServer;

const createWindow = () => {

    expressServer = spawn("node", [
        path.join(__dirname, 'src/server/server.js'),
    ]);

    expressServer.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    expressServer.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 720,
        // fullscreen: true,
        // frame: true,
        // titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'src/js/preload.js')
        }
    });

    ipcMain.on('authorize', (event, url) => {
        const twitterWindow = new BrowserWindow({ parent: mainWindow, modal: true});
        twitterWindow.loadURL(url);
    });

    mainWindow.webContents.openDevTools();

    mainWindow.loadFile('./src/index.html');

    return mainWindow;
}

app.whenReady().then(() => {
    const mainWindow = createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});