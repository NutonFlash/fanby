/* eslint-disable promise/always-return */
/* eslint-disable global-require */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import { resolveHtmlPath } from './util';

const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const config = dotenv.config();

dotenvExpand.expand(config);

const store = new Store();

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const createWindow = async () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1920,
    height: 1080,
    frame: false,
    icon: getAssetPath('/robot/icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.maximize();
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// IPC listener
ipcMain.on('electron-shell-openExternal', async (event, url) => {
  event.returnValue = shell.openExternal(url);
});
ipcMain.on('electron-store-clear', async (event) => {
  event.returnValue = store.clear();
});
ipcMain.on('electron-store-has', async (event, key) => {
  event.returnValue = store.has(key);
});
ipcMain.on('electron-store-get', async (event, key, defaultValue) => {
  event.returnValue = store.get(key, defaultValue);
});
ipcMain.on('electron-store-set', async (event, key, val) => {
  store.set(key, val);
});
ipcMain.on('electron-store-delete', async (event, key) => {
  store.delete(key);
});
ipcMain.on('get-env-variable', (event, key) => {
  event.returnValue = process.env[key];
});
ipcMain.on('minimize-window', () => {
  mainWindow?.minimize();
});
ipcMain.on('maximize-window', () => {
  mainWindow?.maximize();
});
ipcMain.on('restore-window', () => {
  mainWindow?.restore();
});
ipcMain.on('isMaximized', (event) => {
  event.returnValue = mainWindow?.isMaximized();
});
ipcMain.on('close-window', () => {
  mainWindow?.close();
});
